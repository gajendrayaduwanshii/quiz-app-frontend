import OpenAI from "openai";

const GOOGLE_GENERATIVE_LANGUAGE_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta";

const contentToText = (content) => {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return content
    .map((part) => {
      if (typeof part === "string") return part;
      return part?.text || "";
    })
    .filter(Boolean)
    .join("\n"); 
};

const buildGeminiContents = (prompt, messages = []) => {
  const sourceMessages = messages.length
    ? messages
    : [{ role: "user", content: prompt || "" }];

  const systemInstructions = sourceMessages
    .filter((message) => message.role === "system")
    .map((message) => contentToText(message.content))
    .filter(Boolean);

  const contents = sourceMessages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: contentToText(message.content) }],
    }))
    .filter((content) => content.parts[0].text);

  return {
    contents,
    systemInstruction: systemInstructions.length
      ? { parts: [{ text: systemInstructions.join("\n") }] }
      : undefined,
  };
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const getGoogleApiKeys = () =>
  unique([
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY1,
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY2,
  ]);

const getAIConfig = () => {
  const provider = (process.env.AI_PROVIDER || "").toLowerCase();
  const explicitBaseURL = process.env.AI_BASE_URL || process.env.OPENAI_BASE_URL;
  const googleBaseURL =
    process.env.GOOGLE_GENERATIVE_LANGUAGE_BASE_URL ||
    GOOGLE_GENERATIVE_LANGUAGE_BASE_URL;
  const googleApiKeys = getGoogleApiKeys();
  const googleApiKey = googleApiKeys[0];
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const shouldUseGoogleDefaults =
    provider === "google" || provider === "gemini" || (!explicitBaseURL && googleApiKey);
  const useGoogleNative = shouldUseGoogleDefaults && !explicitBaseURL;
  const apiKey = useGoogleNative
    ? googleApiKey || process.env.AI_API_KEY || openaiApiKey
    : process.env.AI_API_KEY || openaiApiKey || googleApiKey;

  return {
    apiKey,
    googleApiKeys,
    provider,
    useGoogleNative,
    baseURL: explicitBaseURL,
    googleBaseURL,
    model:
      process.env.AI_MODEL ||
      (shouldUseGoogleDefaults ? "gemini-flash-latest" : "gpt-4o-mini"),
  };
};

let client;

const assertApiKey = (config) => {
  if (!config.apiKey) {
    throw new Error(
      "AI API key not configured. Set AI_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY."
    );
  }
};

const getClient = () => {
  const config = getAIConfig();

  assertApiKey(config);

  client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });

  return { client, model: config.model };
};

const generateGeminiText = async (prompt, options, config) => {
  if (!config.googleApiKeys?.length) {
    assertApiKey(config);
  }

  const { contents, systemInstruction } = buildGeminiContents(
    prompt,
    options.messages || []
  );

  const apiKeys = config.googleApiKeys?.length
    ? config.googleApiKeys
    : [config.apiKey];
  let lastErrorText = "";
  let lastStatus = 0;

  for (const [index, apiKey] of apiKeys.entries()) {
    const response = await fetch(
      `${config.googleBaseURL}/models/${options.model || config.model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents,
          ...(systemInstruction ? { systemInstruction } : {}),
          generationConfig: {
            temperature: options.temperature ?? 0.4,
            ...(options.responseMimeType
              ? { responseMimeType: options.responseMimeType }
              : {}),
            ...(options.maxTokens ? { maxOutputTokens: options.maxTokens } : {}),
          },
        }),
      }
    );

    if (!response.ok) {
      lastStatus = response.status;
      lastErrorText = await response.text();
      const shouldTryNextKey =
        [400, 401, 403, 429, 500, 503].includes(response.status) &&
        index < apiKeys.length - 1;

      if (shouldTryNextKey) continue;

      throw new Error(`Gemini API request failed: ${response.status} ${lastErrorText}`);
    }

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("") || ""
    );
  }

  throw new Error(`Gemini API request failed: ${lastStatus} ${lastErrorText}`);
};

export const generateAIText = async (prompt, options = {}) => {
  const config = getAIConfig();

  if (config.useGoogleNative) {
    return generateGeminiText(prompt, options, config);
  }

  const { client: aiClient, model } = getClient();

  const response = await aiClient.chat.completions.create({
    model: options.model || model,
    messages: options.messages || [{ role: "user", content: prompt }],
    temperature: options.temperature ?? 0.4,
    max_tokens: options.maxTokens,
  });

  return response?.choices?.[0]?.message?.content || "";
};

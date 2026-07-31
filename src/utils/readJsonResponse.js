export async function readJsonResponse(response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    const preview = text.replace(/\s+/g, " ").trim().slice(0, 180);
    throw new Error(
      `Expected JSON but received ${response.headers.get("content-type") || "unknown content"}: ${preview}`
    );
  }
}

export function extractApiError(data, fallback) {
  return (
    data?.error?.message ||
    data?.error?.details?.errors?.map((err) => err.message).join(", ") ||
    data?.error ||
    fallback
  );
}

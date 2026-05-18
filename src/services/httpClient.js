const parseJson = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return response.text();
  }
  return response.json();
};

export const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message = data?.error || data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

export const postJson = (url, body, options = {}) =>
  request(url, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });

export const putJson = (url, body, options = {}) =>
  request(url, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  });

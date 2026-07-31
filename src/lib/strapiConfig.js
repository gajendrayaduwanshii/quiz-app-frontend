const DEFAULT_STRAPI_URL = "http://localhost:1337";

export function getStrapiUrl() {
  return (
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    DEFAULT_STRAPI_URL
  ).replace(/\/$/, "");
}

export function getStrapiAuthHeaders() {
  const token = process.env.STRAPI_API_TOKEN;

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export function assertConfiguredStrapiUrl(url) {
  const target = new URL(url);
  const configured = new URL(getStrapiUrl());

  if (target.origin !== configured.origin) {
    throw new Error("Only the configured Strapi URL is allowed");
  }

  return target.toString();
}

export function resolveStrapiMediaUrl(url) {
  if (!url) return "";

  const value = String(url);
  if (/^https?:\/\//i.test(value)) return value;

  return `${getStrapiUrl()}${value.startsWith("/") ? value : `/${value}`}`;
}

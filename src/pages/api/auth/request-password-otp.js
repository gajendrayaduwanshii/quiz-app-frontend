import { getStrapiAuthHeaders, getStrapiUrl } from "@/lib/strapiConfig";
import {
  createPasswordResetOtp,
  getResetIdentifierType,
  maskResetIdentifier,
  normalizePhoneDigits,
  normalizeResetIdentifier,
} from "@/lib/passwordResetOtpStore";
import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";

async function fetchUsers(url) {
  const response = await fetch(url, {
    headers: {
      ...getStrapiAuthHeaders(),
    },
  });
  const result = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(extractApiError(result, `Failed to fetch user: ${response.status}`));
  }

  return result?.data || [];
}

async function findUser(identifier, type) {
  const strapiUrl = getStrapiUrl();
  const normalizedIdentifier = normalizeResetIdentifier(identifier);

  if (type === "email") {
    const users = await fetchUsers(
      `${strapiUrl}/api/userlists?filters[email][$eq]=${encodeURIComponent(normalizedIdentifier)}`
    );
    return users[0] || null;
  }

  const exactUsers = await fetchUsers(
    `${strapiUrl}/api/userlists?filters[phoneNumber][$eq]=${encodeURIComponent(identifier.trim())}`
  );

  if (exactUsers[0]) return exactUsers[0];

  const enteredDigits = normalizePhoneDigits(identifier);
  const users = await fetchUsers(`${strapiUrl}/api/userlists?pagination[pageSize]=100`);

  return users.find((user) => {
    const storedDigits = normalizePhoneDigits(user.phoneNumber);
    return (
      storedDigits.length >= 7 &&
      (storedDigits === enteredDigits ||
        storedDigits.endsWith(enteredDigits) ||
        enteredDigits.endsWith(storedDigits))
    );
  }) || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { identifier } = req.body || {};
    const type = getResetIdentifierType(identifier);

    if (!type) {
      return res.status(400).json({ error: "Enter a valid email or mobile number" });
    }

    const user = await findUser(identifier, type);

    if (!user) {
      return res.status(404).json({ error: type === "email" ? "Email not registered" : "Mobile number not registered" });
    }

    const otp = createPasswordResetOtp(identifier, user);

    return res.status(200).json({
      message: "OTP generated successfully",
      destination: maskResetIdentifier(identifier, type),
      channel: type,
      devOtp: otp,
    });
  } catch (error) {
    console.error("Error in /api/auth/request-password-otp:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

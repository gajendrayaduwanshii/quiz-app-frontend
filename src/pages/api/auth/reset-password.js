import { getStrapiAuthHeaders, getStrapiUrl } from "@/lib/strapiConfig";
import {
  consumePasswordResetOtp,
  verifyPasswordResetOtp,
} from "@/lib/passwordResetOtpStore";
import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { identifier, otp, newPassword } = req.body || {};

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ error: "Identifier, OTP, and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const verification = verifyPasswordResetOtp(identifier, otp);

    if (!verification.ok) {
      return res.status(400).json({ error: verification.error });
    }

    const response = await fetch(
      `${getStrapiUrl()}/api/userlists/${verification.entry.documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getStrapiAuthHeaders(),
        },
        body: JSON.stringify({ data: { password: newPassword } }),
      }
    );

    const result = await readJsonResponse(response);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: extractApiError(result, `Failed to reset password: ${response.status}`) });
    }

    consumePasswordResetOtp(verification.key);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in /api/auth/reset-password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

const OTP_TTL_MS = 10 * 60 * 1000;
const otpStore = globalThis.__skillsyncPasswordResetOtpStore || new Map();

globalThis.__skillsyncPasswordResetOtpStore = otpStore;

export function normalizeResetIdentifier(identifier) {
  return String(identifier || "").trim().toLowerCase();
}

export function getResetIdentifierType(identifier) {
  const value = normalizeResetIdentifier(identifier);

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  if (/^\+?[0-9]{7,15}$/.test(value)) return "phone";

  return null;
}

export function normalizePhoneDigits(phone) {
  return String(phone || "").replace(/\D/g, "");
}

export function maskResetIdentifier(identifier, type) {
  const value = normalizeResetIdentifier(identifier);

  if (type === "email") {
    const [name, domain] = value.split("@");
    const visibleName = name.length <= 2 ? name[0] || "*" : `${name[0]}${"*".repeat(Math.max(name.length - 2, 1))}${name[name.length - 1]}`;
    return `${visibleName}@${domain}`;
  }

  const digits = normalizePhoneDigits(value);
  return digits.length > 4 ? `${"*".repeat(Math.max(digits.length - 4, 4))}${digits.slice(-4)}` : "your mobile number";
}

export function createPasswordResetOtp(identifier, user) {
  const key = normalizeResetIdentifier(identifier);
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  otpStore.set(key, {
    otp,
    documentId: user.documentId,
    email: user.email,
    phoneNumber: user.phoneNumber,
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  return otp;
}

export function verifyPasswordResetOtp(identifier, otp) {
  const key = normalizeResetIdentifier(identifier);
  const entry = otpStore.get(key);

  if (!entry) {
    return { ok: false, error: "OTP expired or not requested" };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return { ok: false, error: "OTP expired. Please request a new OTP." };
  }

  if (entry.otp !== String(otp || "").trim()) {
    return { ok: false, error: "Invalid OTP" };
  }

  return { ok: true, entry, key };
}

export function consumePasswordResetOtp(key) {
  otpStore.delete(key);
}

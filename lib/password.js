// Admin paroli uchun kuchlilik talablari. Xato bo'lsa xabar (string),
// parol yaroqli bo'lsa null qaytaradi.
export function validatePasswordStrength(pw) {
  if (typeof pw !== "string" || pw.length < 12) {
    return "Parol kamida 12 belgidan iborat bo'lishi kerak";
  }
  if (!/[a-z]/.test(pw)) return "Parolda kamida bitta kichik harf bo'lishi kerak";
  if (!/[A-Z]/.test(pw)) return "Parolda kamida bitta katta harf bo'lishi kerak";
  if (!/[0-9]/.test(pw)) return "Parolda kamida bitta raqam bo'lishi kerak";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Parolda kamida bitta maxsus belgi bo'lishi kerak";
  return null;
}

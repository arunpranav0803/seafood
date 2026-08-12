export function validateEmail(email: unknown) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: unknown) {
  return typeof phone === 'string' && /^\+?[0-9]{10,14}$/.test(phone);
}

export function validatePassword(password: unknown) {
  return typeof password === 'string' && password.length >= 8;
}

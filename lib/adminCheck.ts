const ADMIN_EMAILS = [
  'bouazzasalah120120@gmail.com',
  'ybenguellah@gmail.com'
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export { ADMIN_EMAILS };

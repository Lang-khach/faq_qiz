// Admin emails - chỉ những email này mới có quyền admin
const ADMIN_EMAILS = [
  'admin@gmail.com',
  'admin@example.com',
  'admin@admin.com',
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check exact match
  if (ADMIN_EMAILS.includes(normalizedEmail)) {
    return true;
  }
  
  // Check if username is 'admin' (before @)
  const username = normalizedEmail.split('@')[0];
  if (username === 'admin') {
    return true;
  }
  
  return false;
}

export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS];
}

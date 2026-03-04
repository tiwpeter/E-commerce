/**
 * Converts a string to a URL-friendly slug.
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Generates a unique slug by appending a timestamp suffix when needed.
 */
export const generateUniqueSlug = (base: string, suffix?: string): string => {
  const slug = slugify(base);
  if (suffix) return `${slug}-${suffix}`;
  return `${slug}-${Date.now()}`;
};

/**
 * Generates a unique order number.
 */
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Generates a mock transaction ID for payment simulation.
 */
export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN-${timestamp}-${random}`;
};

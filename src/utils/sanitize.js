import DOMPurify from 'dompurify';

/**
 * Sanitize user-generated HTML content to prevent XSS attacks.
 * @param {string} dirty - The untrusted input string
 * @returns {string} Sanitized safe string
 */
export function sanitizeHTML(dirty) {
  if (typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize plain text — strips ALL HTML tags.
 * Use for itinerary notes and user text inputs.
 * @param {string} dirty - The untrusted input string
 * @returns {string} Plain text with no HTML
 */
export function sanitizeText(dirty) {
  if (typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

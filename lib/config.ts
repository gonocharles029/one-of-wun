// Store Configuration
export const STORE_NAME = "ONE.OF.WUN";
export const WHATSAPP_PHONE_NUMBER = "231770000000";

/**
 * Builds a formatted WhatsApp link including product name, price, size, and color.
 */
export function buildWhatsAppLink(
  productName: string,
  price?: number | string,
  size?: string,
  color?: string
): string {
  let message = `Hello ${STORE_NAME}, I would like to order:\n\n` +
                `• Product: ${productName}\n` +
                `• Price: $${price ?? "N/A"}`;

  if (size) message += `\n• Size: ${size}`;
  if (color) message += `\n• Color: ${color}`;

  message += `\n\nPlease confirm availability and delivery details.`;

  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}
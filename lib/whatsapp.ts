import { STORE_NAME, WHATSAPP_PHONE_NUMBER } from "@/lib/config";

export interface OrderDetails {
  productName: string;
  size: string;
  name: string;
  phone: string;
  address?: string;
  productId?: string;
  priceFormatted?: string;
  overridePhone?: string;
}

export function buildWhatsAppLink({
  productName,
  size,
  name,
  phone,
  address,
  productId,
  priceFormatted,
  overridePhone,
}: OrderDetails): string {
  const whatsappNumber =
    overridePhone || WHATSAPP_PHONE_NUMBER || "+231773794634";

  let message = `New Order Request - ${STORE_NAME}\n\n`;
  message += `• Product: ${productName}\n`;
  if (priceFormatted) message += `• Price: ${priceFormatted}\n`;
  if (productId) message += `• Item ID: #${productId}\n`;
  message += `• Size: ${size}\n`;
  message += `• Customer Name: ${name}\n`;
  message += `• Customer Phone: ${phone}\n`;

  if (address && address.trim().length > 0) {
    message += `• Delivery Address: ${address}\n`;
  }

  message += `\nDispatch Hub: Weltona Junction, Tuport Road, Monrovia.\nPlease confirm availability and delivery arrangements.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
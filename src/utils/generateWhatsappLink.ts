
export const generateWhatsAppLink = (
  productName: string, 
  productSlug: string, 
  baseUrl: string, 
  whatsappNumber: string
): string => {
  console.log("Generating WhatsApp link with number:", whatsappNumber);
  const productUrl = `${baseUrl}/property/${productSlug}`;
  const message = encodeURIComponent(`Hello, I am interested in the property: ${productName}\n\nProduct link: ${baseUrl}`);
 
  return `https://wa.me/${whatsappNumber}?text=${message}`;
};

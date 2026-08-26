/**
 * Antibot link detection utility.
 * Detects WhatsApp group invite links and other suspicious URLs in messages.
 */
export const LINK_REGEX = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
export const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

export interface LinkDetectionResult {
  detected: boolean;
  links: string[];
  isInvite: boolean;
}

export function detectLinks(text: string): LinkDetectionResult {
  const links: string[] = [];
  let match;
  const inviteRegex = new RegExp(LINK_REGEX.source, "gi");
  while ((match = inviteRegex.exec(text)) !== null) {
    links.push(match[0]);
  }
  const urlRegex = new RegExp(URL_REGEX.source, "gi");
  while ((match = urlRegex.exec(text)) !== null) {
    if (!links.includes(match[0])) links.push(match[0]);
  }
  const isInvite = links.some((l) => LINK_REGEX.test(l));
  return { detected: links.length > 0, links, isInvite };
}

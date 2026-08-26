import { BotCommandContext } from "../bot/types.js";

/**
 * Adapter Bridge Utility - Normalizes external message, sender, group,
 * and media structures from various platforms/sources into a standardized
 * format consumed by the bot engine.
 */

export interface NormalizedMessage {
  id: string;
  from: string;
  sender: string;
  senderName: string;
  isGroup: boolean;
  text: string;
  mediaType: "image" | "video" | "audio" | "document" | null;
  messageTimestamp: number;
  raw: any;
}

/**
 * Normalize an incoming raw Baileys message or simulated external payload
 */
export function normalizeMessage(rawMsg: any): NormalizedMessage {
  if (!rawMsg) {
    throw new Error("Cannot normalize null or undefined message");
  }

  const id = rawMsg.key?.id || Math.random().toString(36).substring(7);
  const from = rawMsg.key?.remoteJid || "";
  const isGroup = from.endsWith("@g.us");

  let sender = rawMsg.key?.participant || rawMsg.key?.remoteJid || "";
  if (!isGroup && rawMsg.key?.fromMe) {
    sender = rawMsg.key?.remoteJid || "";
  }

  const senderName = rawMsg.pushName || "User";
  
  // Extract text from standard Baileys structures
  const messageContent = rawMsg.message || {};
  const text =
    messageContent.conversation ||
    messageContent.extendedTextMessage?.text ||
    messageContent.imageMessage?.caption ||
    messageContent.videoMessage?.caption ||
    "";

  // Identify media type
  let mediaType: "image" | "video" | "audio" | "document" | null = null;
  if (messageContent.imageMessage) mediaType = "image";
  else if (messageContent.videoMessage) mediaType = "video";
  else if (messageContent.audioMessage) mediaType = "audio";
  else if (messageContent.documentMessage) mediaType = "document";

  const messageTimestamp = rawMsg.messageTimestamp 
    ? Number(rawMsg.messageTimestamp) * 1000 
    : Date.now();

  return {
    id,
    from,
    sender,
    senderName,
    isGroup,
    text,
    mediaType,
    messageTimestamp,
    raw: rawMsg
  };
}

/**
 * Creates a fully compatible BotCommandContext from a normalized structure and connection socket.
 */
export function buildAdapterContext(
  sock: any,
  rawMsg: any,
  customArgs?: string[]
): BotCommandContext {
  const normalized = normalizeMessage(rawMsg);
  
  const from = normalized.from;
  const sender = normalized.sender;
  const isOwner = sender.startsWith("447") || sender.startsWith("33") || rawMsg.key?.fromMe || false; // flexible owner check

  const bodyText = normalized.text;
  const prefix = ".";
  const words = bodyText.slice(prefix.length).trim().split(/\s+/);
  const commandName = customArgs ? "" : (words.shift()?.toLowerCase() || "");
  const args = customArgs || words;

  // Standard reply handler
  const reply = async (textStr: string, mediaUrl?: string) => {
    try {
      if (mediaUrl) {
        if (mediaUrl.startsWith("data:")) {
          // Resolve data uri if needed
          const matches = mediaUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
          if (matches && matches.length === 3) {
            const buffer = Buffer.from(matches[2], "base64");
            return await sock.sendMessage(from, {
              image: buffer,
              caption: textStr
            }, { quoted: rawMsg });
          }
        }
        return await sock.sendMessage(from, {
          image: { url: mediaUrl },
          caption: textStr
        }, { quoted: rawMsg });
      } else {
        return await sock.sendMessage(from, { text: textStr }, { quoted: rawMsg });
      }
    } catch (e: any) {
      console.error("[Adapter] Reply error:", e.message);
    }
  };

  // Standard react handler
  const react = async (emoji: string) => {
    try {
      return await sock.sendMessage(from, {
        react: { text: emoji, key: rawMsg.key }
      });
    } catch (e: any) {
      console.error("[Adapter] React error:", e.message);
    }
  };

  // Safe media downloader wrapper
  const downloadMedia = async (): Promise<Buffer | null> => {
    try {
      const messageContent = rawMsg.message || {};
      const messageType = Object.keys(messageContent)[0];
      if (!["imageMessage", "videoMessage", "documentMessage", "audioMessage"].includes(messageType)) {
        return null;
      }
      const stream = await sock.downloadContentFromMessage(
        messageContent[messageType as keyof typeof messageContent],
        messageType.replace("Message", "")
      );
      let buffer = Buffer.alloc(0);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      return buffer;
    } catch (err: any) {
      console.error("[Adapter] Media downloader failed:", err.message);
      return null;
    }
  };

  return {
    sender,
    senderName: normalized.senderName,
    isOwner,
    isAdmin: false, // Updated downstream
    prefix,
    commandName,
    args,
    fullMessage: bodyText,
    reply,
    react,
    downloadMedia
  };
}

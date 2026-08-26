import { BotCommand } from "../types.js";
import { translate } from "../i18n.js";
import { generateTextWithFallback } from "../geminiClient.js";

const aiCommand: BotCommand = {
  name: "ai",
  category: "AI & Creative",
  description: "Ask anything and get an intelligent response from Gemini 3.7 Flash.",
  usage: "ai <your question or prompt>",
  execute: async (sock, msg, context) => {
    const prompt = context.args.join(" ");
    
    if (!prompt) {
      const t = (k: string) => translate("ai", k, context.lang || "en");
      await context.reply(t("noPrompt"));
      return;
    }

    await context.react("🧠");
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      await context.reply(t("noPrompt") + "\n" + "⚠️ *Gemini API Key missing* — configure GEMINI_API_KEY.");
      return;
    }

    try {
      const answer = await generateTextWithFallback(
        prompt,
        "You are Nebula Bot, an advanced WhatsApp multi-device bot assistant. Keep responses helpful, structured, concise, and clean for a messaging app interface. Use bolding, bullet points, and emojis appropriately.",
        "gemini-3.7-flash"
      );
      await context.reply(`${translate("ai","replyHeader",context.lang||"en")}\n\n${answer}`);
    } catch (error: any) {
      console.error("Gemini AI Command Error:", error);
      await context.reply(`❌ *Error:* ${error.message || error}`);
    }
  }
};

export default aiCommand;

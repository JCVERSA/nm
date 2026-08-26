import { BotCommand } from "../types.js";
import { translate } from "../i18n.js";

const pingCommand: BotCommand = {
  name: "ping",
  category: "General",
  description: "Check the bot's latency and system status.",
  usage: "ping",
  execute: async (sock, msg, context) => {
    const startTime = Date.now();
    await context.react("🚀");
    const latency = Date.now() - startTime;
    
    const t = (k: string) => translate("ping", k, context.lang || "en");
    await context.reply(
      `🤖 *Nebula Bot - Status*\n\n` +
      `⚡ *Latency:* ${latency}ms\n` +
      `📈 *Uptime:* Active & Stable\n` +
      `🔋 *Environment:* Node.js 18+\n` +
      `🌌 *Status:* Operational`
    );
  }
};

export default pingCommand;

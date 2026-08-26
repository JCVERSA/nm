import { BotCommand } from "../types.js";
import { database } from "../database.js";

const antibotCommand: BotCommand = {
  name: "antibot",
  category: "Admin",
  group: "Moderation",
  description: "Toggle antibot link detection for this group.",
  usage: ".antibot [on|off]",
  aliases: ["antibotlink"],
  execute: async (sock, msg, context) => {
    if (!context.sender.endsWith("@g.us")) {
      await context.reply("❌ This command only works inside groups.");
      return;
    }
    if (!context.isAdmin && !context.isOwner) {
      await context.reply("❌ Admin access required.");
      return;
    }
    const arg = context.args[0]?.toLowerCase();
    const settings = database.getGroupSettings(context.sender);
    if (arg === "on" || arg === "enable") {
      database.updateGroupSettings(context.sender, { antibot: true });
      await context.reply("✅ Anti-bot link detection is now *enabled*.");
    } else if (arg === "off" || arg === "disable") {
      database.updateGroupSettings(context.sender, { antibot: false });
      await context.reply("❌ Anti-bot link detection is now *disabled*.");
    } else {
      const status = settings.antibot ? "enabled" : "disabled";
      await context.reply(`ℹ️ Anti-bot link detection is currently *${status}*.
Usage: .antibot on / .antibot off`);
    }
  },
};

export default antibotCommand;

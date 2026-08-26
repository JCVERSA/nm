import { BotCommand } from "../types.js";
import { kickGroupMember } from "../../utils/adapter.js";

const kickCommand: BotCommand = {
  name: "kick",
  category: "Admin",
  group: "Moderation",
  description: "Kick a member from the group by mentioning them.",
  usage: ".kick @user or .kick <number>",
  aliases: ["remove"],
  execute: async (sock, msg, context) => {
    if (!context.sender.endsWith("@g.us")) {
      await context.reply("❌ This command only works inside groups.");
      return;
    }
    if (!context.isAdmin && !context.isOwner) {
      await context.reply("❌ Admin access required.");
      return;
    }
    const target = context.args[0];
    if (!target) {
      await context.reply("❌ Provide a user to kick. Example: `.kick @1234567890`");
      return;
    }
    let jid = target;
    if (target.startsWith("@")) jid = target.slice(1) + "@s.whatsapp.net";
    else if (!target.includes("@")) jid = target.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    try {
      const ok = await kickGroupMember(sock, context.sender, jid);
      if (ok) await context.reply(`✅ Kicked @${jid.split("@")[0]}.`);
      else await context.reply("❌ Failed to kick user (bot may not be admin or user not found).");
    } catch (e: any) {
      await context.reply(`❌ Kick error: ${e.message}`);
    }
  },
};

export default kickCommand;

import { BotCommand } from "../types.js";
import { promoteGroupMember } from "../../utils/adapter.js";

const promoteCommand: BotCommand = {
  name: "promote",
  category: "Admin",
  group: "Moderation",
  description: "Promote a member to group admin.",
  usage: ".promote @user or .promote <number>",
  aliases: ["makeadmin"],
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
      await context.reply("❌ Provide a user to promote. Example: `.promote @1234567890`");
      return;
    }
    let jid = target;
    if (target.startsWith("@")) jid = target.slice(1) + "@s.whatsapp.net";
    else if (!target.includes("@")) jid = target.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    try {
      const ok = await promoteGroupMember(sock, context.sender, jid);
      if (ok) await context.reply(`✅ Promoted @${jid.split("@")[0]} to admin.`);
      else await context.reply("❌ Failed to promote user.");
    } catch (e: any) {
      await context.reply(`❌ Promote error: ${e.message}`);
    }
  },
};

export default promoteCommand;

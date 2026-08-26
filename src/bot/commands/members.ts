import { BotCommand } from "../types.js";
import { getGroupParticipants } from "../../utils/adapter.js";

const membersCommand: BotCommand = {
  name: "members",
  category: "Admin",
  group: "Moderation",
  description: "List all members in the current group with admin markers.",
  usage: ".members",
  aliases: ["memberlist", "listmembers"],
  execute: async (sock, msg, context) => {
    if (!context.sender.endsWith("@g.us")) {
      await context.reply("❌ This command only works inside groups.");
      return;
    }
    if (!context.isAdmin && !context.isOwner) {
      await context.reply("❌ Admin access required.");
      return;
    }
    try {
      const participants = await getGroupParticipants(sock, context.sender);
      if (!participants || participants.length === 0) {
        await context.reply("No members found.");
        return;
      }
      const admins = participants.filter((p: any) => p.admin === "admin" || p.admin === "superadmin");
      const members = participants.filter((p: any) => !p.admin);
      let text = `👥 *Members*\nTotal: *${participants.length}*\n\n`;
      if (admins.length > 0) {
        text += `👑 *Admins (${admins.length})*\n`;
        text += admins.map((a: any) => `• @${a.id.split("@")[0]}`).join("\n") + "\n\n";
      }
      text += `👤 *Members (${members.length})*\n`;
      text += members.slice(0, 50).map((m: any) => `• @${m.id.split("@")[0]}`).join("\n");
      if (members.length > 50) text += `\n_...and ${members.length - 50} more_`;
      await context.reply(text);
    } catch (e: any) {
      await context.reply(`❌ Error fetching members: ${e.message}`);
    }
  },
};

export default membersCommand;

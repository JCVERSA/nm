import { BotCommand } from "../types.js";
import { translate } from "../i18n.js";
import { database } from "../database.js";
import { getConfig, updateConfig } from "../config.js";

const langCommand: BotCommand = {
  name: "lang",
  category: "Admin",
  group: "Moderation",
  description: "Switch bot language between English (en) and French (fr).",
  usage: ".lang en / .lang fr",
  aliases: ["language"],
  execute: async (sock, msg, context) => {
    const arg = context.args[0]?.toLowerCase();
    const lang: "en" | "fr" = arg === "fr" ? "fr" : "en";
    const isGroup = context.sender.endsWith("@g.us");

    if (isGroup) {
      if (!context.isAdmin && !context.isOwner) {
        await context.reply(translate("members", "noAdmin", context.lang || "en"));
        return;
      }
      database.updateGroupSettings(context.sender, { language: lang });
    } else {
      if (!context.isOwner) {
        await context.reply("❌ Owner only.");
        return;
      }
      updateConfig({ language: lang });
    }

    const t = (key: string) => translate("lang", key, lang);
    await context.reply(`${t("set")}${lang === "fr" ? "Français" : "English"}.\n${t("usage")}`);
  },
};

export default langCommand;

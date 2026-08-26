/**
 * Bot command responses — English (en) and French (fr).
 * Commands can access via translate(command, key, lang).
 */
export type Lang = "en" | "fr";

export const translations: Record<string, Record<string, { en: string; fr: string }>> = {
  ping: {
    reply: { en: "🏓 Pong! Bot is alive and responding.", fr: "🏓 Pong ! Le bot est actif et répond." },
  },
  menu: {
    reply: { en: "📋 *Available Commands*", fr: "📋 *Commandes disponibles*" },
    core: { en: "*Core:* ping, menu, ai, help", fr: "*Core :* ping, menu, ai, aide" },
    media: { en: "*Media:* image, video, joke, quote", fr: "*Média :* image, vidéo, joke, citation" },
    mod: { en: "*Moderation:* antilink, antitag, members", fr: "*Modération :* antilink, antitag, members" },
  },
  ai: {
    noPrompt: { en: "❌ Please provide a prompt!", fr: "❌ Veuillez fournir une question !" },
    error: { en: "❌ AI error: ", fr: "❌ Erreur IA : " },
    replyHeader: { en: "🌌 *Nebula AI Assistant*", fr: "🌌 *Assistant IA Nebula*" },
  },
  members: {
    onlyGroup: { en: "❌ This command only works inside groups.", fr: "❌ Cette commande fonctionne uniquement dans un groupe." },
    noAdmin: { en: "❌ Admin access required.", fr: "❌ Accès administrateur requis." },
    replyHeader: { en: "👥 *Members*", fr: "👥 *Membres*" },
    total: { en: "Total: *", fr: "Total : *" },
    admins: { en: "👑 *Admins*", fr: "👑 *Administrateurs*" },
    members: { en: "👤 *Members*", fr: "👤 *Membres*" },
  },
  kick: {
    onlyGroup: { en: "❌ This command only works inside groups.", fr: "❌ Cette commande fonctionne uniquement dans un groupe." },
    noAdmin: { en: "❌ Admin access required.", fr: "❌ Accès administrateur requis." },
    noTarget: { en: "❌ Provide a user to kick.", fr: "❌ Indiquez un utilisateur à exclure." },
    success: { en: "✅ Kicked @", fr: "✅ Exclu @" },
    fail: { en: "❌ Failed to kick user.", fr: "❌ Échec de l'exclusion." },
  },
  promote: {
    onlyGroup: { en: "❌ This command only works inside groups.", fr: "❌ Cette commande fonctionne uniquement dans un groupe." },
    noAdmin: { en: "❌ Admin access required.", fr: "❌ Accès administrateur requis." },
    noTarget: { en: "❌ Provide a user to promote.", fr: "❌ Indiquez un utilisateur à promouvoir." },
    success: { en: "✅ Promoted @", fr: "✅ Promu @" },
    fail: { en: "❌ Failed to promote user.", fr: "❌ Échec de la promotion." },
  },
  lang: {
    set: { en: "✅ Language set to ", fr: "✅ Langue réglée sur " },
    current: { en: "🌐 Current language: ", fr: "🌐 Langue actuelle : " },
    usage: { en: "Usage: .lang en / .lang fr", fr: "Utilisation : .lang en / .lang fr" },
  },
  antibot: {
    onlyGroup: { en: "❌ This command only works inside groups.", fr: "❌ Cette commande fonctionne uniquement dans un groupe." },
    noAdmin: { en: "❌ Admin access required.", fr: "❌ Accès administrateur requis." },
    on: { en: "✅ Anti-bot link detection is now *enabled*.", fr: "✅ Détection de liens anti-bot : *activée*." },
    off: { en: "❌ Anti-bot link detection is now *disabled*.", fr: "❌ Détection de liens anti-bot : *désactivée*." },
    status: { en: "ℹ️ Anti-bot link detection is currently *", fr: "ℹ️ Détection de liens anti-bot : *" },
  },
};

export function translate(cmd: string, key: string, lang: Lang = "en"): string {
  const cmdData = translations[cmd];
  if (!cmdData || !cmdData[key]) return "";
  return cmdData[key][lang] ?? cmdData[key]["en"];
}

/*
@Christus
@XaviaCMD
*/

import moment from "moment-timezone";
import { easyCMD } from "cassidy-utils";

const cmd = easyCMD({
  name: "notification",
  meta: {
    otherNames: ["notif", "broadcast"],
    author: "Christus Dev AI",
    description: "Envoie une notification dans tous les groupes du bot.",
    icon: "🔔",
    version: "2.0.0",
    role: 2, // admin seulement
  },
  title: {
    content: "🌌 CHRISTUS BOT NOTIFICATION SYSTEM",
    text_font: "bold",
    line_bottom: "double",
  },
  content: {
    content: null,
    text_font: "none",
    line_bottom: "hidden",
  },
  run(ctx) {
    return main(ctx);
  },
});

async function main({ api, args, message, threadsData, event }: CommandContext) {
  const content = args.join(" ");
  if (!content)
    return message.reply("❌ Veuillez entrer le contenu de la notification à envoyer.");

  const allThreads = await threadsData.getAll(); // récupère tous les groupes
  const totalThreads = allThreads.length;

  const now = moment().tz("Africa/Abidjan").format("DD/MM/YYYY HH:mm:ss");

  const notifMessage = `
━━━━━━━━━━━━━━━━━━━━━━━
🌌 𝗖𝗛𝗥𝗜𝗦𝗧𝗨𝗦 𝗕𝗢𝗧 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 🔔
━━━━━━━━━━━━━━━━━━━━━━━

📢 **Message global :**
${content}

📅 **Envoyé le :** ${now}
🤖 **Système :** Christus Dev AI

━━━━━━━━━━━━━━━━━━━━━━━
_© 2025 Christus Bot | InterAstra Network_
`;

  let sent = 0;
  message.reply(`📣 Envoi de la notification à ${totalThreads} groupes...`);

  for (const thread of allThreads) {
    try {
      await api.sendMessage(notifMessage, thread.threadID);
      sent++;
      await new Promise((r) => setTimeout(r, 300)); // petite pause pour éviter le flood
    } catch (err) {
      console.log(`⚠️ Erreur sur le groupe ${thread.threadID}: ${err.message}`);
    }
  }

  message.reply(`✅ Notification envoyée avec succès dans ${sent}/${totalThreads} groupes !`);
}

export default cmd;

import axios from "axios";
import { StrictOutputForm } from "output-cassidy";
import path from "path";
import * as fs from "fs";

const cmd = easyCMD({
  name: "callad",
  meta: {
    otherNames: ["report", "re"],
    author: "MrkimstersDev | Liane",
    description:
      "Report a message to admins with optional category and anonymity, or respond to reports.",
    icon: "📝",
    version: "1.2.1",
    noPrefix: false,
  },
  title: {
    content: "📨 Call Admin System",
    text_font: "bold",
    line_bottom: "default",
  },
  content: {
    content: "Contact admins easily with reports or anonymous messages.",
    text_font: "italic",
    line_bottom: "hidden",
  },
  run(ctx) {
    return main(ctx);
  },
});

interface CalladReport {
  senderID: string;
  senderName: string;
  message: string;
  category?: string;
  anonymous?: boolean;
}

const adminReplies: Record<string, { userID: string }> = {};

async function main({ output, args, input, api, usersDB, threadsData }: CommandContext) {
  await output.reaction("🟡");

  if (!args.length) {
    await output.reaction("🔴");
    return output.reply(
      `⚠️ Usage: +callad [-c <category>] [-a] <message>\n\nExample:\n+callad -c bug Le bot ne répond plus correctement`
    );
  }

  // Parse args
  let category: string | undefined;
  let anonymous = false;
  const messageParts: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i].toLowerCase();
    if (arg === "-c" && args[i + 1]) {
      category = args[i + 1];
      i++;
    } else if (arg === "-a") {
      anonymous = true;
    } else {
      messageParts.push(args[i]);
    }
  }

  const messageBody = messageParts.join(" ");
  if (!messageBody) {
    await output.reaction("🔴");
    return output.reply("⚠️ Merci de préciser un message à envoyer.");
  }

  const userInfo = await usersDB?.getUserInfo?.(input.sid).catch(() => null);
  const senderName = userInfo?.name || input.name || "Utilisateur inconnu";

  const report: CalladReport = {
    senderID: input.sid,
    senderName,
    message: messageBody,
    category,
    anonymous,
  };

  const formattedReport = `
━━━━━━━━━━━━━━━
📨 𝗡𝗢𝗨𝗩𝗘𝗔𝗨 𝗥𝗔𝗣𝗣𝗢𝗥𝗧
──────────────────────────
👤 𝗘𝗻𝘃𝗼𝘆𝗲𝘂𝗿: ${anonymous ? "🕵️ Anonyme" : senderName}
🆔 ID: ${anonymous ? "🔒 Caché" : input.sid}
🏷️ 𝗖𝗮𝘁𝗲́𝗴𝗼𝗿𝗶𝗲: ${category || "N/A"}
──────────────────────────
💬 𝗠𝗲𝘀𝘀𝗮𝗴𝗲:
${messageBody}
━━━━━━━━━━━━━━━
💡 Répondez à ce message pour répondre à l'utilisateur.
━━━━━━━━━━━━━━━
  `.trim();

  // 🔍 Récupération des groupes (multi-compatibilité)
  let threads: any[] = [];

  try {
    if (threadsData?.getAll) {
      threads = await threadsData.getAll();
    } else if (global.GoatBot?.threadsData?.getAll) {
      threads = await global.GoatBot.threadsData.getAll();
    } else {
      console.warn("⚠️ Aucun accès à threadsData, envoi uniquement au groupe actuel.");
      threads = [{ threadID: input.threadID }];
    }
  } catch (err) {
    console.error("❌ Erreur récupération threads:", err);
    threads = [{ threadID: input.threadID }];
  }

  // Filtrer les groupes actifs
  const groups = threads.filter((t: any) => t?.threadID);
  let sentCount = 0;

  for (const thread of groups) {
    try {
      const sent = await api.sendMessage(formattedReport, thread.threadID);
      adminReplies[sent.messageID] = { userID: input.sid };
      sentCount++;
    } catch (err) {
      console.warn(`⚠️ Envoi échoué pour ${thread.threadID}`);
    }
  }

  await output.reaction("🟢");
  await output.reply(
    `✅ Rapport envoyé avec succès à ${sentCount} admin(s) de groupe.\nMerci pour ton signalement 💫`
  );
}

// ======================================
// 📩 Réponse admin
// ======================================
export async function onReply({ api, event }: any) {
  const replyData = adminReplies[event.messageReply?.messageID];
  if (!replyData) return;

  try {
    await api.sendMessage(`📩 Réponse d’un admin :\n${event.body}`, replyData.userID);
    delete adminReplies[event.messageReply.messageID];
  } catch (err) {
    console.error("Erreur lors de la réponse admin :", err);
  }
}

export default cmd;

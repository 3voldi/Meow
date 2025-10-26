import axios from "axios";
import { StrictOutputForm } from "output-cassidy";
import path from "path";
import * as fs from "fs";

// ======================================
// 🌌 ❲ CassidyAstral ❳
// ======================================
const cmd = easyCMD({
  name: "callad",
  meta: {
    otherNames: ["report", "re"],
    author: "Christus",
    description:
      "Report a message to admins with optional category and anonymity, or respond to reports.",
    icon: "📝",
    version: "1.1.9",
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

// ======================================
// INTERFACES
// ======================================
interface CalladReport {
  senderID: string;
  senderName: string;
  message: string;
  category?: string;
  anonymous?: boolean;
}

// Mémoire temporaire pour les réponses admin
const adminReplies: Record<string, { userID: string }> = {};

// ======================================
// MAIN FUNCTION
// ======================================
async function main({
  output,
  args,
  input,
  usersDB,
  threadsData,
  api,
}: CommandContext) {
  await output.reaction("🟡");

  if (args.length === 0) {
    await output.reaction("🔴");
    return output.reply(
      `⚠️ Usage: +callad [-c <category>] [-a] <message>\n\nExample:\n+callad -c bug Le bot ne répond plus correctement`
    );
  }

  // Parse les arguments
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

  const userInfo = await usersDB.getUserInfo(input.sid);
  const senderName = userInfo?.name || input.name || "Utilisateur inconnu";

  // Création du rapport
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

  output.setStyle(cmd.style);

  // Récupération de tous les admins
  const allThreads = await threadsData.getAll();
  const adminThreads = allThreads.filter(
    (t) => t.isGroup && t.adminIDs?.length > 0
  );

  let sendSuccess = 0;

  for (const thread of adminThreads) {
    try {
      const sent = await api.sendMessage(formattedReport, thread.threadID);
      adminReplies[sent.messageID] = { userID: input.sid };
      sendSuccess++;
    } catch (err) {
      console.error(`[❌] Erreur d'envoi à ${thread.threadID}:`, err);
    }
  }

  await output.reaction("🟢");
  await output.reply(
    `✅ Rapport envoyé avec succès à ${sendSuccess} admin(s) !\nMerci pour ton retour 💫`
  );
}

// ======================================
// SYSTEME DE RÉPONSE ADMIN
// ======================================
export async function onReply({ api, event }: any) {
  const replyData = adminReplies[event.messageReply?.messageID];
  if (!replyData) return;

  try {
    await api.sendMessage(
      `📩 Réponse de l’admin :\n${event.body}`,
      replyData.userID
    );
    delete adminReplies[event.messageReply.messageID];
  } catch (err) {
    console.error("Erreur lors de la réponse admin :", err);
  }
}

// ======================================
// EXPORT FINAL
// ======================================
export default cmd;

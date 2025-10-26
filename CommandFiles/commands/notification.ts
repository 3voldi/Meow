/*
@Christus
@CassidyAstral
*/

import { getStreamsFromAttachment } from "../../utils/global"; // ajuste le chemin selon ta structure

interface EnvConfig {
  delayPerGroup: number;
}

interface Langs {
  missingMessage: string;
  notification: string;
  sendingNotification: string;
  sentNotification: string;
  errorSendingNotification: string;
}

const config = {
  name: "notification",
  aliases: ["notify", "noti"],
  version: "3.0.0",
  author: "Christus | CassidyAstral",
  countDown: 5,
  role: 3,
  description: {
    fr: "Envoie une notification stylée à tous les groupes.",
    en: "Send a styled notification to all groups."
  },
  category: "🔔 Notifications",
  guide: {
    fr: "{pn} <message>\nExemple : {pn} Mise à jour disponible 🚀"
  },
  envConfig: {
    delayPerGroup: 250
  } as EnvConfig
};

const langs = {
  fr: {
    missingMessage: "⚠️ Veuillez entrer le message à envoyer à tous les groupes.",
    notification:
      "🌌 ❲ 𝗖𝗮𝘀𝘀𝗶𝗱𝘆𝗔𝘀𝘁𝗿𝗮𝗹 ❳ 🌌\n━━━━━━━━━━━━━━━\n📢 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗴𝗹𝗼𝗯𝗮𝗹𝗲 𝗱𝗲 𝗹’𝗮𝗱𝗺𝗶𝗻",
    sendingNotification:
      "🚀 Début de l’envoi de la notification vers %1 groupes...",
    sentNotification: "✅ Notification envoyée avec succès à %1 groupes.",
    errorSendingNotification:
      "❌ Erreur pendant l’envoi à %1 groupes :\n%2"
  },
  en: {
    missingMessage: "Please enter the message you want to send to all groups.",
    notification:
      "🌌 ❲ CassidyAstral ❳ 🌌\n━━━━━━━━━━━━━━━\n📢 Global notification from admin",
    sendingNotification:
      "🚀 Starting to send notification to %1 chat groups...",
    sentNotification: "✅ Successfully sent notification to %1 groups.",
    errorSendingNotification:
      "❌ An error occurred while sending to %1 groups:\n%2"
  }
};

async function onStart({
  api,
  event,
  args,
  message,
  threadsData,
  envCommands
}: any) {
  const lang = langs.fr;
  const { delayPerGroup } = envCommands[config.name] as { delayPerGroup: number };

  if (!args[0]) return message.reply(lang.missingMessage);

  const formSend: any = {
    body: `${lang.notification}\n────────────────\n${args.join(" ")}`,
    attachment: await getStreamsFromAttachment(
      [
        ...event.attachments,
        ...(event.messageReply?.attachments || [])
      ].filter((item: any) =>
        ["photo", "png", "animated_image", "video", "audio"].includes(item.type)
      )
    )
  };

  // 🧩 Récupération des groupes actifs
  let allThreads: any[] = [];
  try {
    allThreads = (await threadsData.getAll()).filter(
      (t: any) =>
        t.isGroup &&
        t.members.find((m: any) => m.userID == api.getCurrentUserID())?.inGroup
    );
  } catch (err) {
    console.error("❌ threadsData non disponible :", err);
    return message.reply("⚠️ Erreur interne : impossible d’accéder aux groupes (threadsData).");
  }

  if (!allThreads || allThreads.length === 0)
    return message.reply("⚠️ Aucun groupe valide trouvé pour l’envoi.");

  message.reply(lang.sendingNotification.replace("%1", allThreads.length.toString()));

  let successCount = 0;
  const sendErrors: any[] = [];
  const pendingSends: any[] = [];

  for (const thread of allThreads) {
    try {
      pendingSends.push({
        threadID: thread.threadID,
        pending: api.sendMessage(formSend, thread.threadID)
      });
      await new Promise((res) => setTimeout(res, delayPerGroup));
    } catch {
      sendErrors.push(thread.threadID);
    }
  }

  for (const sent of pendingSends) {
    try {
      await sent.pending;
      successCount++;
    } catch (e: any) {
      const { errorDescription } = e;
      const existing = sendErrors.find((x) => x.errorDescription === errorDescription);
      if (existing) existing.threadIDs.push(sent.threadID);
      else
        sendErrors.push({
          threadIDs: [sent.threadID],
          errorDescription
        });
    }
  }

  let resultMsg = "";
  if (successCount > 0)
    resultMsg += lang.sentNotification.replace("%1", successCount.toString()) + "\n";
  if (sendErrors.length > 0)
    resultMsg += lang.errorSendingNotification
      .replace(
        "%1",
        sendErrors.reduce((a, b) => a + b.threadIDs.length, 0)
      )
      .replace(
        "%2",
        sendErrors.reduce(
          (a, b) =>
            a +
            `\n - ${b.errorDescription}\n  + ${b.threadIDs.join("\n  + ")}`,
          ""
        )
      );

  message.reply(resultMsg || "✅ Diffusion terminée sans erreur 🎉");
}

export default {
  config,
  langs,
  onStart
};

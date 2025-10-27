/*
@XaviaCMD
@Christus
*/

import axios from "axios";
import fs from "fs-extra";
import path from "path";

const config = {
  name: "pin",
  aliases: ["pinterest"],
  version: "2.0.1",
  permissions: [0],
  credits: "Christus x Aesther",
  description: "Pinterest Image Search powered by Christus Bot",
  category: "Downloader",
  usages: "[query] - [number]",
  cooldown: 10
};

const getBaseApiUrl = async (): Promise<string> => {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
  );
  return data.api;
};

export default {
  config,

  // Utilise la même signature que ta commande JS d'origine
  onStart: async function ({ api, event, args }: { api: any; event: any; args: string[] }) {
    const queryAndLength = args.join(" ").split("-");
    const q = queryAndLength[0]?.trim();
    const lengthStr = queryAndLength[1]?.trim();

    if (!q || !lengthStr) {
      return api.sendMessage("❌| Wrong Format. Usage: pin <query> - <number>", event.threadID, event.messageID);
    }

    const limit = parseInt(lengthStr, 10);
    if (Number.isNaN(limit) || limit <= 0) {
      return api.sendMessage("❌| Invalid number for limit.", event.threadID, event.messageID);
    }

    // dossier temporaire pour stocker les images
    const tempDir = path.join(__dirname, "temp_pinterest");
    try {
      const waitMsg = await api.sendMessage("🔎 Please wait... fetching images", event.threadID);

      const apiBase = await getBaseApiUrl();
      const res = await axios.get(`${apiBase}/pinterest?search=${encodeURIComponent(q)}&limit=${encodeURIComponent(limit)}`);
      const data: string[] = res.data?.data;

      if (!data || data.length === 0) {
        // retire le message d'attente si possible
        try { await api.unsendMessage(waitMsg.messageID); } catch (e) { /* ignore */ }
        return api.sendMessage("⚠️ Empty response or no images found.", event.threadID, event.messageID);
      }

      const totalImagesCount = Math.min(data.length, limit);
      const attachments: fs.ReadStream[] = [];

      await fs.ensureDir(tempDir);

      for (let i = 0; i < totalImagesCount; i++) {
        const imgUrl = data[i];
        const imgBuffer = (await axios.get(imgUrl, { responseType: "arraybuffer" })).data;
        const imgPath = path.join(tempDir, `${Date.now()}_${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgBuffer);
        attachments.push(fs.createReadStream(imgPath));
      }

      // retire le message d'attente
      try { await api.unsendMessage(waitMsg.messageID); } catch (e) { /* ignore */ }

      const formattedMessage =
`━━━━━━━━━━━━━━━
🇨🇮 𝗖𝗵𝗿𝗶𝘀𝘁𝘂𝘀 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁 🇨🇮
━━━━━━━━━━━━━━━
📌 𝗤𝘂𝗲𝗿𝘆: ${q}
🖼️ 𝗜𝗺𝗮𝗴𝗲𝘀 𝗦𝗲𝗻𝘁: ${totalImagesCount}

━━━━━━━ ✕ ━━━━━━
𝖡𝗋𝗈𝗐𝗌𝗂𝗇𝗀 𝗧𝗁𝗋𝗈𝗎𝗀𝗁 𝗜𝗺𝗮𝗴𝗶𝗻𝗮𝘁𝗶𝗼𝗻 🇨🇮`;

      await api.sendMessage({ body: formattedMessage, attachment: attachments }, event.threadID, event.messageID);

      // cleanup: fermer les streams et supprimer le dossier temporaire
      try {
        attachments.forEach((s: any) => { if (s && typeof s.close === "function") s.close(); });
        await fs.remove(tempDir);
      } catch (cleanupErr) {
        console.warn("Cleanup failed:", cleanupErr);
      }
    } catch (error: any) {
      console.error(error);
      return api.sendMessage(`❌ Error: ${error?.message || error}`, event.threadID, event.messageID);
    }
  }
};

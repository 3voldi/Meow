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
  version: "2.0.0",
  permissions: [0],
  credits: "Christus x Aesther",
  description: "Pinterest Image Search powered by Christus Bot",
  category: "Downloader",
  usages: "[query] - [number]",
  cooldown: 10
};

// 🔹 Fonction pour obtenir le lien d’API dynamique
const getBaseApiUrl = async (): Promise<string> => {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
  );
  return data.api;
};

async function onCall({ message, args }: { message: any; args: string[] }) {
  const queryInput = args.join(" ").split("-");
  const query = queryInput[0]?.trim();
  const limit = queryInput[1]?.trim();

  if (!query || !limit) {
    return message.reply("❌ | Wrong format. Use: `pin <query> - <number>`");
  }

  try {
    const waitingMsg = await message.reply("🔎 Searching Pinterest images, please wait...");

    const apiBase = await getBaseApiUrl();
    const response = await axios.get(
      `${apiBase}/pinterest?search=${encodeURIComponent(query)}&limit=${encodeURIComponent(limit)}`
    );

    const data: string[] = response.data.data;
    if (!data || data.length === 0) {
      return message.reply("⚠️ No images found for your query.");
    }

    const totalImages = Math.min(data.length, parseInt(limit));
    const imagePaths: fs.ReadStream[] = [];

    // 📥 Téléchargement des images
    for (let i = 0; i < totalImages; i++) {
      const imgUrl = data[i];
      const imgBuffer = (await axios.get(imgUrl, { responseType: "arraybuffer" })).data;
      const imgPath = path.join(__dirname, "temp_pinterest", `${i + 1}.jpg`);
      await fs.outputFile(imgPath, imgBuffer);
      imagePaths.push(fs.createReadStream(imgPath));
    }

    // Supprime le message d’attente
    await message.unsend(waitingMsg.messageID);

    // Envoi du message final
    const formattedMessage = 
`━━━━━━━━━━━━━━━
🇨🇮 𝗖𝗵𝗿𝗶𝘀𝘁𝘂𝘀 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁 🇨🇮
━━━━━━━━━━━━━━━
📌 𝗤𝘂𝗲𝗿𝘆: ${query}
🖼️ 𝗜𝗺𝗮𝗴𝗲𝘀 𝗙𝗼𝘂𝗻𝗱: ${totalImages}

━━━━━━━ ✕ ━━━━━━
𝖡𝗋𝗈𝗐𝗌𝗂𝗇𝗀 𝗧𝗁𝗋𝗈𝗎𝗀𝗁 𝗜𝗺𝗮𝗴𝗶𝗇𝗮𝘁𝗶𝗼𝗻 🇨🇮`;

    await message.reply({ body: formattedMessage, attachment: imagePaths });

  } catch (error: any) {
    console.error(error);
    message.reply(`❌ Error: ${error.message}`);
  }
}

export default {
  config,
  onCall
};

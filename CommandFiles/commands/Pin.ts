/*
@Christus x Aesther
Pinterest Image Search Command (TypeScript)
*/

import axios from "axios";
import fs from "fs-extra";
import path from "path";
import { defineCommand } from "@cassidy/command";
import { UNISpectra } from "@cassidy/unispectra";

interface PinterestResponse {
  status: boolean;
  data: string[];
}

async function baseApiUrl(): Promise<string> {
  const base = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
  );
  return base.data.api;
}

const command = defineCommand({
  meta: {
    name: "pin",
    otherNames: ["pinterest"],
    version: "2.0.0",
    author: "Christus x Aesther",
    description: "Rechercher des images sur Pinterest",
    category: "Download",
    role: 0,
    allowModerators: true,
    noPrefix: false,
    icon: "📸",
    cmdType: "media_dl",
  },

  style: {
    title: "📍 Pinterest Image Search",
    titleFont: "bold",
    contentFont: "clean",
    topLine: "double",
  },

  async entry({ input, output, style }) {
    const args = input.text.split("-");
    const query = args[0]?.trim();
    const limit = parseInt(args[1]?.trim());

    if (!query || !limit || isNaN(limit)) {
      return output.replyStyled(
        "❌ | Format incorrect.\nUtilisation : **pin <mot clé> - <nombre>**\nExemple : `pin cat - 5`",
        style
      );
    }

    const waiting = await output.replyStyled(
      `${UNISpectra.dots} Recherche d’images pour **${query}**...`,
      style
    );

    try {
      const apiUrl = await baseApiUrl();
      const response = await axios.get<PinterestResponse>(
        `${apiUrl}/pinterest?search=${encodeURIComponent(query)}&limit=${encodeURIComponent(
          limit.toString()
        )}`
      );

      const data = response.data.data;
      if (!data || data.length === 0) {
        return output.replyStyled(
          "❌ | Aucun résultat trouvé pour ta recherche.",
          style
        );
      }

      const totalImages = Math.min(data.length, limit);
      const attachments: any[] = [];

      for (let i = 0; i < totalImages; i++) {
        const imgUrl = data[i];
        const imgBuffer = await axios.get(imgUrl, { responseType: "arraybuffer" });
        const filePath = path.join(process.cwd(), "temp", `pin_${i + 1}.jpg`);
        await fs.outputFile(filePath, imgBuffer.data);
        attachments.push(fs.createReadStream(filePath));
      }

      await output.unsend(waiting.messageID);

      await output.replyStyled(
        `✅ | Voici les résultats pour **${query}**\n✏️ | Total : **${totalImages}** images`,
        style,
        attachments
      );

      // Nettoyage des fichiers temporaires
      for (let i = 0; i < totalImages; i++) {
        const filePath = path.join(process.cwd(), "temp", `pin_${i + 1}.jpg`);
        await fs.remove(filePath);
      }
    } catch (error: any) {
      console.error(error);
      await output.replyStyled(`❌ | Erreur : ${error.message}`, style);
    }
  },
});

export default command;

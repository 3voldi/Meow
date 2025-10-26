/*
@XaviaCMD
@Christus
*/

import axios from "axios";
import { Client, Message } from "discord.js";

export const config = {
  name: "pixarai",
  description: "🎨 Génère une image IA dans un style artistique/mangatique",
  usage: "<prompt>",
  category: "image",
  author: "Christus",
  version: "1.0.0",
};

export async function run(client: Client, message: Message, args: string[]) {
  const prompt = args.join(" ");
  if (!prompt)
    return message.reply("🎭 | Donne-moi une idée d'image à créer, artiste !");

  try {
    const apiUrl = `https://arychauhann.onrender.com/api/pixarai?prompt=${encodeURIComponent(
      prompt
    )}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.status || !data.result?.url)
      return message.reply("❌ | Impossible de générer ton image, réessaie plus tard.");

    const imageUrl = data.result.url;

    const embed = {
      color: 0x6a0dad,
      title: "🌌 𝗣𝗶𝘅𝗮𝗥𝗔𝗶 — 𝗠𝗮𝗻𝗴𝗮 𝗖𝗿𝗲𝗮𝘁𝗶𝗼𝗻",
      description: `> 🖋️ Prompt : **${prompt}**  
> 🎨 *L'art prend vie dans chaque pixel...*`,
      image: { url: imageUrl },
      footer: {
        text: `🧠 Model: PixAR AI | Operator: ${data.operator}`,
      },
    };

    await message.reply({ embeds: [embed] });
  } catch (error: any) {
    console.error(error);
    message.reply("⚠️ | Une erreur est survenue pendant la génération de ton œuvre.");
  }
}

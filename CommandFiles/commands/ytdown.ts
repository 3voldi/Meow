import axios, { AxiosResponse } from "axios";
import { StrictOutputForm } from "output-cassidy";

const cmd = easyCMD({
  name: "ytdown",
  meta: {
    author: "Christus Dev AI",
    description: "Télécharge de la musique ou des vidéos YouTube avec style manga 🎥🎵",
    version: "1.0.0",
    category: "media",
    icon: "🎬",
    noPrefix: "both",
  },
  title: {
    content: "⚔️ 𝐙𝐨𝐫𝐨 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫",
    text_font: "bold",
    line_bottom: "double",
  },
  run(ctx) {
    return main(ctx);
  },
});

interface APIResponse {
  operator: string;
  y2matenu: Record<string, any>;
  ytmp3cc: Record<string, any>;
  ytmp4blog: Record<string, any>;
  mp3dl: Record<string, any>;
  ezmp4: Record<string, any>;
}

async function main({ output, args, input, prefix, commandName, cancelCooldown }: CommandContext) {
  const url = args.join(" ");
  await output.reaction("⚪");

  if (!url) {
    cancelCooldown();
    await output.reaction("🔴");
    return output.reply(
      `🎴 **Zoro** croise ses sabres :  
      > “Tu veux que je télécharge *quoi* exactement ?”  
      Utilise comme ceci :  
      **${prefix}${commandName} <url YouTube>**`
    );
  }

  const api = `https://arychauhann.onrender.com/api/ytdownloader?url=${encodeURIComponent(url)}`;
  const res: AxiosResponse<APIResponse> = await axios.get(api);

  const data = res.data;
  const operator = data.operator || "Unknown";

  const errors = Object.values(data)
    .filter((v: any) => v && v.error)
    .map((v: any) => v.error)
    .slice(0, 2);

  let form: StrictOutputForm = {
    body: `⚔️ **Zoro Downloader**  
━━━━━━━━━━━━━━━━━━  
> “L'ennemi a plusieurs portes, choisis bien ta voie.”  
\n🎵 **1. Télécharger en Audio (MP3)**  
🎬 **2. Télécharger en Vidéo (MP4)**  
\n_Opérateur: ${operator}_`,
  };

  await output.reaction("🟡");
  const replyMsg = await output.reply(form);

  replyMsg.atReply(async (rep) => {
    const choice = rep.input.body.trim();
    if (choice === "1" || choice.toLowerCase().includes("mp3")) {
      await output.reply(`🎧 **Zoro**: “Je coupe le son du monde pour toi...”\nTéléchargement MP3 en cours...`);
      await processDownload(url, "mp3", output);
    } else if (choice === "2" || choice.toLowerCase().includes("mp4")) {
      await output.reply(`🎥 **Zoro**: “Prépare-toi à voir le spectacle.”\nTéléchargement MP4 en cours...`);
      await processDownload(url, "mp4", output);
    } else {
      await output.reply(`🤨 **Zoro**: “Hein ? Parle plus clairement... choisis **1** ou **2**.”`);
    }
  });

  await output.reaction("🟢");
}

async function processDownload(url: string, type: "mp3" | "mp4", output: any) {
  const api = `https://arychauhann.onrender.com/api/ytdownloader?url=${encodeURIComponent(url)}`;
  const res: AxiosResponse<APIResponse> = await axios.get(api);
  const data = res.data;

  const result = Object.values(data)
    .find((v: any) => v && v.success && v.downloadUrl)
    as any;

  if (!result) {
    return output.reply(
      `⚠️ **Zoro**: “Tch... cette cible est coriace.”  
Aucune ${type.toUpperCase()} n’a pu être trouvée pour ce lien.`
    );
  }

  await output.reply({
    body: `✅ **Téléchargement ${type.toUpperCase()} réussi !**  
> _“Zoro l’a tranché net, voici ton butin.”_`,
    attachment: [
      {
        url: result.downloadUrl,
        name: `zoro-${Date.now()}.${type}`,
      },
    ],
  });
}

export default cmd;

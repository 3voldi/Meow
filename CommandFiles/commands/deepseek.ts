import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { StrictOutputForm } from "output-cassidy";

// ─────────────── CONFIGURATION DE LA COMMANDE ───────────────
const cmd = easyCMD({
  name: "deepseek",
  meta: {
    otherNames: ["ds3", "deepseek3", "askai", "brain"],
    author: "Christus Dev AI",
    description:
      "💡 DeepSeek 3 — An advanced AI oracle that responds with style and intelligence.",
    icon: "🌌",
    version: "2.0.0",
    noPrefix: "both",
  },
  title: {
    content: "🌌 DEEPSEEK 3 SYSTEM 🧠",
    text_font: "futuristic",
    line_bottom: "glow",
  },
  content: {
    content: "Type your question or idea, and watch the cosmos reply...",
    text_font: "italic",
    line_bottom: "fade",
  },
  run(ctx) {
    return main(ctx);
  },
});

export interface ResponseType {
  status: boolean;
  result?: string;
  id?: string;
}

// ─────────────── LOGIQUE PRINCIPALE ───────────────
async function main({
  output,
  args,
  commandName,
  prefix,
  input,
  cancelCooldown,
}: CommandContext) {
  const ask = args.join(" ");
  await output.reaction("⚙️");

  // 🧩 Vérification entrée utilisateur
  if (!ask) {
    cancelCooldown();
    await output.reaction("❌");
    return output.reply(
      `💭 **Missing question!**\n\nTry:\n> ${prefix}${commandName} How does AI dream?`
    );
  }

  try {
    // 🛰️ API Call
    const apiURL = `https://arychauhann.onrender.com/api/deepseek3?prompt=${encodeURIComponent(
      ask
    )}`;

    const headers: AxiosRequestConfig["headers"] = {
      "Content-Type": "application/json",
    };

    const res: AxiosResponse<ResponseType> = await axios.get(apiURL, {
      headers,
      timeout: 25_000,
    });

    const answer = res.data?.result?.trim() || "⚠️ No response from DeepSeek 3.";
    const threadId = res.data?.id ? `🧾 **Thread ID:** \`${res.data.id}\`` : "";

    // 🌈 Création du message stylé
    const form: StrictOutputForm = {
      body: `╭─── 🌌 **DEEPSEEK 3 SYSTEM ONLINE** ───╮
│ 👤 **User:** ${input.senderName || "Unknown"}
│ 💬 **Prompt:** ${ask}
│ 🧠 **Response:**
│ ${answer}
╰─────────────────────────────╯

${threadId}
✨ *You can reply below to continue the conversation.*`,
    };

    // 🟢 Indicateur de réussite
    await output.reaction("🚀");

    const info = await output.reply(form);

    // 💬 Gestion des réponses threadées
    info.atReply(async (rep) => {
      rep.output.setStyle(cmd.style);
      await output.reaction("🌀");
      await main({ ...rep, args: rep.input.words });
    });
  } catch (err: any) {
    console.error("Error calling DeepSeek 3 API:", err?.message || err);
    await output.reaction("🔻");
    cancelCooldown();
    return output.reply(
      `⚠️ **Error connecting to DeepSeek 3 API**\n\n> Message: \`${err?.message || "Unknown error"}\`\n> Try again later.`
    );
  }
}

// ─────────────── EXPORT ───────────────
export default cmd;

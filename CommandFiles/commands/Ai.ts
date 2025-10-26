import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { StrictOutputForm } from "output-cassidy";

const cmd = easyCMD({
  name: "ai",
  meta: {
    otherNames: ["gai", "askgemini"],
    author: "Christus Dev AI",
    description: "A conversational AI powered by Gemini.",
    icon: "🌌",
    version: "1.0.0",
    noPrefix: "both",
  },
  title: {
    content: "Christus bot 🌌",
    text_font: "bold",
    line_bottom: "default",
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

export interface GeminiResponseType {
  status: boolean;
  reply?: string;
}

async function main({
  output,
  args,
  commandName,
  prefix,
  input,
  cancelCooldown,
}: CommandContext) {
  const text = args.join(" ");
  await output.reaction("🌌");

  if (!text) {
    cancelCooldown();
    await output.reaction("🙅");
    return output.reply(
      `❓ Please provide a question for **Christus AI**.\n\nExample: ${prefix}${commandName} How does quantum computing work?`
    );
  }

  try {
    const headers: AxiosRequestConfig["headers"] = {
      "Content-Type": "application/json",
    };

    const apiURL = `https://arychauhann.onrender.com/api/gemini?uid=${input.sid}&prompt=${encodeURIComponent(
      text
    )}`;

    const res: AxiosResponse<GeminiResponseType> = await axios.get(apiURL, {
      headers,
      timeout: 25_000,
    });

    const response = res.data?.reply || "⚠️ No response from Gemini AI.";

    const form: StrictOutputForm = {
      body: `━━━━━━━━━━━━━━━
🌌 𝗖𝗵𝗿𝗶𝘀𝘁𝘂𝘀 𝗯𝗼𝘁 🌌
━━━━━━━━━━━━━━━
💬 𝗬𝗼𝘂 𝗮𝘀𝗸𝗲𝗱: ${text}
💡 𝗖𝗵𝗿𝗶𝘀𝘁𝘂𝘀 𝗮𝗶 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲: ${response}
━━━━━━━ ✕ ━━━━━━
𝖠𝗌 𝖳𝗁𝖾 𝖩𝗈𝗎𝗋𝗇𝖾𝗒𝗌 𝖨𝗻 𝖳𝗁𝖾 𝖲𝗍𝖺𝗋𝗌, 𝖳𝗁𝖾𝗋𝖾'𝗌 𝖭𝗈 𝖲𝗍𝗈𝗉𝗉𝗂𝗇𝗀. 🇨🇮`,
    };

    await output.reaction("🌌");
    const info = await output.reply(form);

    info.atReply((rep) => {
      rep.output.setStyle(cmd.style);
      main({ ...rep, args: rep.input.words });
    });

  } catch (err: any) {
    console.error("Error calling Gemini API:", err?.message || err);
    await output.reaction("🙅");
    cancelCooldown();
    return output.reply(
      `❗ An error occurred while connecting to the API.\n\nMessage: ${
        err?.message || "Unknown error"
      }`
    );
  }
}

export default cmd;

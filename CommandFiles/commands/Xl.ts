import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { StrictOutputForm } from "output-cassidy";

const cmd = easyCMD({
  name: "xl",
  meta: {
    otherNames: ["xlai", "xlgenerator", "xlimage"],
    author: "Christus Dev AI",
    description: "Generate high-quality images using XL AI.",
    icon: "🖼️",
    version: "1.0.1",
    noPrefix: "both",
  },
  title: {
    content: "XL AI 🖼️",
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

export interface XLResponse {
  status: string;
  operator: string;
  url?: string;
}

async function main({
  output,
  args,
  commandName,
  prefix,
  cancelCooldown,
}: CommandContext) {
  const prompt = args.join(" ");
  await output.reaction("🕐");

  if (!prompt) {
    cancelCooldown();
    await output.reaction("❌");
    return output.reply(
      `💬 Please provide a prompt for **XL AI**.\n\nExample: ${prefix}${commandName} A futuristic city at sunset`
    );
  }

  try {
    const apiURL = `https://arychauhann.onrender.com/api/xl?prompt=${encodeURIComponent(
      prompt
    )}`;

    const res: AxiosResponse<XLResponse> = await axios.get(apiURL, {
      headers: { "Content-Type": "application/json" },
      timeout: 25_000,
    });

    if (res.data.status !== "success" || !res.data.url) {
      await output.reaction("⚠️");
      cancelCooldown();
      return output.reply("⚠️ Failed to generate the XL AI image. Try again.");
    }

    const form: StrictOutputForm = {
      body: `🖼️ **XL AI Result**\nPrompt: ${prompt}`,
      image: res.data.url, // ← Ici l'image est envoyée directement
    };

    await output.reaction("✅");
    await output.reply(form);
  } catch (err: any) {
    console.error("Error calling XL AI API:", err?.message || err);
    await output.reaction("⚠️");
    cancelCooldown();
    return output.reply(
      `❗ **API connection error**\nMessage: ${err?.message || "Unknown error"}`
    );
  }
}

export default cmd;

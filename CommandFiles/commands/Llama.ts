import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { StrictOutputForm } from "output-cassidy";

const cmd = easyCMD({
  name: "llama",
  meta: {
    otherNames: ["ai", "llama4", "askllama"],
    author: "Christus Dev AI",
    description:
      "A conversational AI powered by LLaMA-4 Maverick 17B Instruct.",
    icon: "🦙",
    version: "1.0.0",
    noPrefix: "both",
  },
  title: {
    content: "LLaMA-4 Maverick 17B🤾",
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

export interface LlamaResponseType {
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
  let ask = args.join(" ");
  await output.reaction("🤾");

  if (!ask) {
    cancelCooldown();
    await output.reaction("🙅");
    return output.reply(
      `❓ Please provide a question for **LLaMA Bot**.\n\nExample: ${prefix}${commandName} How does quantum computing work?`
    );
  }

  try {
    const headers: AxiosRequestConfig["headers"] = {
      "Content-Type": "application/json",
    };

    // Endpoint LLaMA-4 Maverick
    const apiURL = `https://arychauhann.onrender.com/api/llama-4-maverick-17b-128e-instruct?uid=${input.sid}&prompt=${encodeURIComponent(
      ask
    )}&url=`;

    const res: AxiosResponse<LlamaResponseType> = await axios.get(apiURL, {
      headers,
      timeout: 25_000,
    });

    const answer = res.data?.reply || "⚠️ No response from LLaMA Bot.";

    const form: StrictOutputForm = {
      body: `🌌 **Christus LLaMA**\n\n${answer}\n\n***You can reply to continue the conversation.***`,
    };

    await output.reaction("🤾");
    const info = await output.reply(form);

    info.atReply((rep) => {
      rep.output.setStyle(cmd.style);
      main({ ...rep, args: rep.input.words });
    });
  } catch (err: any) {
    console.error("Error calling LLaMA API:", err?.message || err);
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

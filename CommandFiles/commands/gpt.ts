import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { StrictOutputForm } from "output-cassidy";
import path from "path";
import * as fs from "fs";

const cmd = easyCMD({
  name: "gpt",
  meta: {
    otherNames: ["gpt4o", "ai2", "ask"],
    author: "Christus Dev AI",
    description:
      "A versatile assistant that provides information, answers questions, and assists with a wide range of tasks.",
    icon: "🤖",
    version: "1.3.2",
    noPrefix: "both",
  },
  title: {
    content: "GPT-4O FREE 🖼️🎓",
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

export interface ResponseType {
  status: boolean;
  operator?: string;
  result?: string;
  conversationId?: string | number;
  conversationLength?: number;
}

async function main({
  output,
  args,
  commandName,
  prefix,
  input,
  cancelCooldown,
  usersDB,
  command,
}: CommandContext) {
  let ask = args.join(" ");
  await output.reaction("🟡");
  if (!ask) {
    cancelCooldown();
    await output.reaction("🔴");
    return output.reply(
      `❓ Please provide a question for **Christus Bot**.\n\n***Example:*** ${prefix}${commandName} what is quantum AI?`
    );
  }

  try {
    const user = await usersDB.getUserInfo(input.sid);
    const userGame = await usersDB.getCache(input.sid);

    if (user?.name || userGame.name) {
      ask = `${user?.name || userGame.name} Info:\n\nThey have ${Number(
        userGame.money
      ).toLocaleString()} balance in the Cassidy Chatbot System.\n\n${
        user?.name || userGame.name
      } asked:\n\n${ask}`;
    }

    if (input.replier && input.replier.body) {
      ask = `${ask}\n\nUser replied with:\n\n${input.replier.body}`;
    }

    if (input.replier && input.replier.attachmentUrls.length > 0) {
      ask = `${ask}\n\nUser also sent attachments:\n\n${input.replier.attachmentUrls.join(
        ", "
      )}`;
    }

    const headers: AxiosRequestConfig["headers"] = {
      "Content-Type": "application/json",
    };

    output.setStyle(cmd.style);

    // ✅ Nouveau endpoint API gpt5 (Aryan Chauhan)
    const apiURL = `https://arychauhann.onrender.com/api/gpt5?prompt=${encodeURIComponent(
      ask
    )}&uid=${input.sid}&reset=`;

    const res: AxiosResponse<ResponseType> = await axios.get(apiURL, {
      headers,
      timeout: 25_000,
    });

    const data = res.data;
    const answer = data?.result || "⚠️ No response from Christus Bot.";
    const operator = data?.operator ? `Operator: ${data.operator}` : null;
    const convoMeta =
      data?.conversationId || data?.conversationLength
        ? `Conversation ID: ${data?.conversationId ?? "N/A"} | Length: ${
            data?.conversationLength ?? "N/A"
          }`
        : null;

    const bodyLines = [
      "🌌 **Christus Bot**",
      "",
      answer,
      "",
      operator ? `_${operator}_` : null,
      convoMeta ? `_${convoMeta}_` : null,
      "",
      "***You can reply to continue the conversation.***",
    ].filter(Boolean);

    const form: StrictOutputForm = {
      body: bodyLines.join("\n"),
    };

    console.log("GPT5 API response:", data);
    await output.reaction("🟢");
    const info = await output.reply(form);

    // Permet de continuer la conversation si l'utilisateur répond au message du bot
    info.atReply((rep) => {
      rep.output.setStyle(cmd.style);
      main({ ...rep, args: rep.input.words });
    });
  } catch (err: any) {
    console.error("Error calling GPT5 API:", err?.message || err);
    await output.reaction("🔴");
    cancelCooldown();
    return output.reply(
      `❗ Une erreur est survenue lors de la connexion à l'API.\n\nMessage: ${
        err?.message || "Unknown error"
      }`
    );
  }
}

export default cmd;

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { StrictOutputForm } from "output-cassidy";
import path from "path";
import * as fs from "fs";

const cmd = easyCMD({
  name: "gpt",
  meta: {
    otherNames: ["gpt4o", "ai", "ask"],
    author: "From Aryan Chauhan REST API, handled by Liane Cagara",
    description:
      "A versatile assistant that provides information, answers questions, and assists with a wide range of tasks.",
    icon: "🤖",
    version: "1.4.0",
    noPrefix: "both",
  },
  title: {
    content: ""GPT-4O FREE 🖼️🎓",",
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
  message: string;
  result?: {
    id: string;
    model: string;
    choices: {
      index: number;
      message: {
        role: string;
        content: string;
      };
    }[];
  };
}

async function main({
  output,
  args,
  commandName,
  prefix,
  input,
  cancelCooldown,
  usersDB,
}: CommandContext) {
  let ask = args.join(" ");
  await output.reaction("🟡");

  if (!ask) {
    cancelCooldown();
    await output.reaction("🔴");
    return output.reply(
      `🔎 Please provide a question for **gpt**.\n\n***Example*** ${prefix}${commandName} what is artificial intelligence?`
    );
  }

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
    ask = `${ask}\n\nUser replied with this message:\n\n${input.replier.body}`;
  }

  if (input.replier && input.replier.attachmentUrls.length > 0) {
    ask = `${ask}\n\nUser also sent these attachments:\n\n${input.replier.attachmentUrls.join(
      ", "
    )}`;
  }

  const headers: AxiosRequestConfig["headers"] = {
    Accept: "application/json",
    "User-Agent": "CassidyChatbot/1.4 (GPT Command)",
  };

  output.setStyle(cmd.style);

  // === New API integration ===
  const apiUrl = `https://arychauhann.onrender.com/api/gpt-3.5-turbo`;
  const params = new URLSearchParams({
    prompt: ask,
    uid: input.sid,
    reset: "false",
  });

  const res: AxiosResponse<ResponseType> = await axios.get(
    `${apiUrl}?${params.toString()}`,
    { headers }
  );

  const response = res.data;
  const answer =
    response.result?.choices?.[0]?.message?.content ||
    response.message ||
    "⚠️ No response received from the AI.";

  const form: StrictOutputForm = {
    body: answer + "\n\n***You can reply to this conversation.***",
  };

  await output.reaction("🟢");
  const info = await output.reply(form);

  info.atReply((rep) => {
    rep.output.setStyle(cmd.style);
    main({ ...rep, args: rep.input.words });
  });
}

export default cmd;

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
    version: "1.3.1",
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
  message: string;
  status?: boolean;
  result?: any;
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

  // 🔁 Nouveau endpoint API (celui que tu as donné)
  const apiURL = `https://arychauhann.onrender.com/api/gpt-3.5-turbo?prompt=${encodeURIComponent(
    ask
  )}&uid=${input.sid}&reset=`;

  const res: AxiosResponse<ResponseType> = await axios.get(apiURL, {
    headers,
  });

  const answer = res.data?.message || "⚠️ No response from Christus Bot.";

  const form: StrictOutputForm = {
    body: `🌌 **Christus Bot**\n\n${answer}\n\n***You can reply to continue the conversation.***`,
  };

  console.log(res.data, form);

  await output.reaction("🟢");
  const info = await output.reply(form);
  info.atReply((rep) => {
    rep.output.setStyle(cmd.style);
    main({ ...rep, args: rep.input.words });
  });
}

export default cmd;

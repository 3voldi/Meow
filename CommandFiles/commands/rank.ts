import { UNIRedux } from "../modules/unisym.js";

export const meta: CommandMeta = {
  name: "rank",
  description: "Displays your in-game rank and experience.",
  version: "1.1.7",
  usage: "{prefix}{name}",
  category: "Utilities",
  author: "JenicaDev",
  permissions: [0],
  noPrefix: false,
  otherNames: ["level", "exp"],
  waitingTime: 0.1,
  cmdType: "cplx_g",
};

export function formatNumber(number: number) {
  const absNumber = Math.abs(number);

  if (absNumber >= 1e21) {
    return (number / 1e21).toFixed(2) + " Sextillion";
  } else if (absNumber >= 1e18) {
    return (number / 1e18).toFixed(2) + " Quintillion";
  } else if (absNumber >= 1e15) {
    return (number / 1e15).toFixed(2) + " Quadrillion";
  } else if (absNumber >= 1e12) {
    return (number / 1e12).toFixed(2) + " Trillion";
  } else if (absNumber >= 1e9) {
    return (number / 1e9).toFixed(2) + " Billion";
  } else if (absNumber >= 1e6) {
    return (number / 1e6).toFixed(2) + " Million";
  } else if (absNumber >= 1e3) {
    return (number / 1e3).toFixed(2) + " Thousand";
  } else {
    return String(number);
  }
}

export const style: CommandStyle = {
  title: "🌟 Rank",
  titleFont: "bold",
  contentFont: "fancy",
  lineDeco: "altar",
};

export async function entry({ money, input, output, CassEXP }: CommandContext) {
  const progressBar = (prog: number, need: number, totalBars = 7) => {
    const bar = "🟨";
    const empty = "⬜";
    const percent =
      need > 0
        ? Math.min(Math.max(Math.round((prog / need) * 100), 0), 100)
        : 0;
    const filledBars = Math.min(
      Math.max(Math.round((percent / 100) * totalBars), 0),
      totalBars
    );
    const emptyBars = totalBars - filledBars;

    const barX = bar.repeat(filledBars) + empty.repeat(emptyBars);
    return barX;
  };

  const allData = await money.getAll();

  const topData = Object.entries(allData).sort(
    (a, b) =>
      new CassEXP(b[1].cassEXP).getEXP() - new CassEXP(a[1].cassEXP).getEXP()
  );

  if (input.arguments[0] === "top") {
    let { participantIDs = [] } = input;
    if (!Array.isArray(participantIDs)) {
      participantIDs = [];
    }

    const topList = topData.slice(0, 10);

    const formattedTopList = topList.map(([, data], index) => {
      const { name, cassEXP } = data;
      const cxp = new CassEXP(cassEXP);

      return `${UNIRedux.arrow} ${index + 1}. ${name} 🌟\n${
        UNIRedux.arrowFromT
      } Level: ${cxp.getLevel()}\n${
        UNIRedux.arrowFromT
      } Experience: ${cxp.getEXP()} / ${cxp.getNextEXP()}\n${
        UNIRedux.arrowFromT
      } Current: ${cxp.getEXPCurrentLv()} / ${
        cxp.getNextEXP() - CassEXP.getEXPFromLevel(cxp.level - 1)
      }\n${UNIRedux.arrowFromT} ${progressBar(
        cxp.getEXPCurrentLv(),
        cxp.getNextEXP()
      )}\n`;
    });

    const response = formattedTopList.length
      ? `🌟 Top 10 List:\n${formattedTopList.join("\n")}`
      : "No data available for the top list.";

    return output.replyStyled(response, {
      ...style,
    });
  }

  let { senderID } = input;
  if (input.replier) {
    ({ senderID } = input.replier);
  }
  if (input.hasMentions) {
    ({ senderID } = input.firstMention);
  }
  if (input.arguments[0]) {
    senderID = input.arguments[0];
  }

  const data = await money.getItem(input.senderID);
  if (!data) {
    return output.reply(
      `${UNIRedux.arrow} ${
        input.senderID !== senderID ? data.name ?? "Unregistered" : "You"
      } are not yet registered in our system.`
    );
  }
  const { cassEXP } = data;
  const cxp = new CassEXP(cassEXP);

  const canv = new CanvCass(CanvCass.preW, CanvCass.preH / 2);
  await canv.drawBackground();
  const container = CanvCass.createRect({
    centerX: canv.centerX,
    centerY: canv.centerY,
    height: canv.height * 0.9,
    width: canv.width,
  });

  canv.drawBox({
    rect: container,
    fill: "rgba(0, 0, 0, 0.5)",
  });

  const lines = CanvCass.lineYs(container.height, 2);
  const d = lines[1] - lines[0];

  const margin = 100;

  const top = topData.findIndex((i) => i[1].userID === senderID) + 1;

  canv.drawText(`👤 ${data.name}`, {
    cssFont: `bold 50px Cassieah-Bold, EMOJI, sans-serif`,
    x: container.left + margin,
    y: lines.at(0),
    align: "left",
    baseline: "middle",
    fill: "white",
  });
  canv.drawText(`#${top}`, {
    cssFont: `bold 60px Cassieah-Bold, EMOJI, sans-serif`,
    x: container.right - margin,
    y: lines.at(0),
    align: "right",
    baseline: "middle",
    fill: "white",
  });

  const per = Math.min(
    1,
    Math.max(0, cxp.getEXPCurrentLv() / cxp.getNextEXP())
  );

  const bar = CanvCass.createRect({
    left: margin,
    centerY: lines.at(1),
    width: canv.width - margin * 2,
    height: 70,
  });
  const barP = CanvCass.createRect({
    left: margin,
    centerY: lines.at(1),
    width: (canv.width - margin * 2) * per,
    height: 70,
  });
  canv.drawBox({
    rect: bar,
    fill: "rgba(0, 0, 0, 0.5)",
  });
  canv.drawBox({
    rect: barP,
    fill: canv.defaultGradient(barP.width, barP.height),
  });

  canv.drawText(`Level ${cxp.getLevel()}`, {
    cssFont: `bold 40px Cassieah-Bold, EMOJI, sans-serif`,
    x: container.left + margin,
    y: lines.at(0) + d / 2,
    align: "left",
    baseline: "middle",
    fill: "white",
  });

  canv.drawText(
    `${cxp.getEXPCurrentLv()} / ${
      cxp.getNextEXP() - CassEXP.getEXPFromLevel(cxp.level - 1)
    }`,
    {
      cssFont: `bold 40px Cassieah-Bold, EMOJI, sans-serif`,
      x: bar.centerX,
      y: lines.at(1),
      align: "center",
      baseline: "middle",
      fill: "white",
    }
  );

  output.reply({
    body: `${UNIRedux.arrow} ${
      input.senderID !== senderID ? data.name ?? "Unregistered" : "You"
    } are at Level ${cxp.getLevel()} with ${cxp.getEXP()} / ${cxp.getNextEXP()} experience points.\n${
      UNIRedux.arrowFromT
    } Current: ${cxp.getEXPCurrentLv()} / ${
      cxp.getNextEXP() - CassEXP.getEXPFromLevel(cxp.level - 1)
    } \n\n${UNIRedux.arrowFromT} ${progressBar(
      cxp.getEXPCurrentLv(),
      cxp.getNextEXP()
    )}`,
    attachment: await canv.toStream(),
  });
}

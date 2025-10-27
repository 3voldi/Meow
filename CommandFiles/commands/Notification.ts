// commands/notification.ts
import type { CommandMeta, CommandEntryParams } from "../types" /* adapte le path si besoin */;

export const meta: CommandMeta = {
  name: "notification",
  otherNames: ["notif", "announce"],
  author: "Christus",
  version: "1.0.2",
  description: "Envoie une notification dans tous les groupes/threads où le bot est présent. Utiliser --test pour prévisualiser.",
  usage: "{prefix}notification [--test] <message>",
  category: "Admin",
  noPrefix: false,
  permissions: [2], // 2 = bot admin seulement
  botAdmin: true,
  waitingTime: 30,
  ext_plugins: { output: "^1.0.0" },
  whiteList: null,
  args: [
    {
      degree: 0,
      fallback: null,
      response: "Vous devez fournir un message pour la notification. Utilisez --test pour essai.",
      search: "message",
      required: true
    }
  ],
  supported: "^4.0.0"
};

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Tentatives multiples pour récupérer la liste des threads du bot.
 * Retourne un tableau d'objets contenant au minimum { threadID } ou { id }.
 */
async function getThreadsFallback(api: any): Promise<any[]> {
  const candidates: any[] = [];

  // 1) api.getAllThreads()
  try {
    if (typeof api.getAllThreads === "function") {
      const t = await api.getAllThreads();
      if (Array.isArray(t)) return t;
      if (t && Array.isArray(t.threads)) return t.threads;
    }
  } catch (e) { console.warn("getAllThreads failed:", e); }

  // 2) api.getThreads()
  try {
    if (typeof api.getThreads === "function") {
      const t = await api.getThreads();
      if (Array.isArray(t)) return t;
    }
  } catch (e) { console.warn("getThreads failed:", e); }

  // 3) api.threads (propriété)
  try {
    if (Array.isArray(api.threads)) return api.threads;
  } catch (e) { /* ignore */ }

  // 4) api.getThreadList / api.fetchThreads
  try {
    if (typeof api.getThreadList === "function") {
      const t = await api.getThreadList();
      if (Array.isArray(t)) return t;
    }
  } catch (e) { console.warn("getThreadList failed:", e); }

  try {
    if (typeof api.fetchThreads === "function") {
      const t = await api.fetchThreads();
      if (Array.isArray(t)) return t;
    }
  } catch (e) { console.warn("fetchThreads failed:", e); }

  // 5) fallback: essayer d'extraire des propriétés communes (si api._threads, api.cache, etc.)
  try {
    if (api._threads && Array.isArray(api._threads)) return api._threads;
    if (api.cache && Array.isArray(api.cache.threads)) return api.cache.threads;
  } catch (e) { /* ignore */ }

  // 6) si rien, retourne un tableau vide pour éviter crash
  return candidates;
}

export async function entry({ input, output, api }: CommandEntryParams) {
  const rawArgs = input.arguments || [];
  if (rawArgs.length === 0) {
    return output.reply("❌ Utilisation : {prefix}notification [--test] <message>");
  }

  const isTest = rawArgs.includes("--test") || rawArgs.includes("-t");
  const filteredArgs = rawArgs.filter(a => a !== "--test" && a !== "-t");
  const message = filteredArgs.join(" ").trim();
  if (!message) return output.reply("❌ Vous devez préciser un message. Exemple : {prefix}notification Salut tout le monde !");

  // confirmation simple en test
  if (isTest) {
    // en mode test, envoie seulement un message dans le thread courant pour preview
    try {
      await output.send(`📢 [TEST] Prévisualisation de notification :\n\n${message}`, input.threadID);
      return output.reply("✅ Message de test envoyé dans ce thread.");
    } catch (err) {
      console.error("Erreur envoi test notification:", err);
      return output.error("❌ Échec de l'envoi de test. Vérifie les permissions/logs.");
    }
  }

  // récupère threads avec fallback
  let threads: any[] = [];
  try {
    threads = await getThreadsFallback(api);
  } catch (err) {
    console.error("Erreur getThreadsFallback:", err);
  }

  if (!Array.isArray(threads) || threads.length === 0) {
    // si on n'a rien obtenu, propose des instructions de debug
    const helpMsg = [
      "❌ Impossible de récupérer la liste des threads du bot.",
      "Vérifie :",
      "- que l'API expose bien une méthode comme `getAllThreads`, `getThreads`, `getThreadList`, ou `api.threads`.",
      "- que le bot a chargé ses threads (vérifie les logs au démarrage).",
      "- exécute `npm run update` et redéploie si nécessaire."
    ].join("\n");
    return output.error(helpMsg);
  }

  // normalize threads -> array of objects with threadID property
  const normalized = threads.map(t => {
    if (!t) return null;
    // possible shapes : { threadID }, { id }, simple id string, { threadID: '123', ... }
    if (typeof t === "string") return { threadID: t };
    if (t.threadID) return { ...t, threadID: t.threadID };
    if (t.id) return { ...t, threadID: t.id };
    if (t.thread_id) return { ...t, threadID: t.thread_id };
    return t; // keep as-is; we'll check below
  }).filter(Boolean);

  if (normalized.length === 0) {
    return output.error("❌ Aucun thread valide trouvé après normalisation. Consulte les logs pour voir la structure retournée par l'API.");
  }

  // Envoi avec rate-limit et collecte des erreurs
  const results: { threadID: string, ok: boolean, error?: any }[] = [];
  const delayMs = 600; // délai entre envois (600ms) — ajuste si tu es bloqué par rate limits

  for (const td of normalized) {
    const tid = td.threadID || td.id || td.thread_id;
    if (!tid) {
      results.push({ threadID: "unknown", ok: false, error: "no-id" });
      continue;
    }

    try {
      // supporte plusieurs signatures d'output.send : send(text, id) ou send(id, text)
      if (typeof output.send === "function") {
        try {
          // première tentative : send(message, id)
          await output.send(message, tid);
        } catch (e1) {
          // deuxième tentative : send(id, message)
          try {
            await output.send(tid, message);
          } catch (e2) {
            // enfin : si output.send non compatible, essayer api.sendMessage
            if (api && typeof api.sendMessage === "function") {
              await api.sendMessage(message, tid);
            } else {
              throw e2; // remonter l'erreur
            }
          }
        }
      } else if (api && typeof api.sendMessage === "function") {
        await api.sendMessage(message, tid);
      } else {
        throw new Error("no-send-method");
      }

      results.push({ threadID: tid, ok: true });
    } catch (err) {
      console.error(`Échec envoi vers ${tid}:`, err);
      results.push({ threadID: tid, ok: false, error: String(err) });
    }

    // pause pour éviter spam/rate-limit
    await sleep(delayMs);
  }

  const success = results.filter(r => r.ok).length;
  const failed = results.length - success;
  // build small report (limiter la taille si beaucoup de threads)
  const failedList = results.filter(r => !r.ok).slice(0, 15).map(r => `${r.threadID} (${r.error})`);
  const report = [
    `✅ Notifications envoyées: ${success}`,
    `❌ Échecs: ${failed}`,
    failed > 0 ? `Échecs (exemples):\n• ${failedList.join("\n• ")}` : null,
    "Si tu as des échecs, vérifie : permissions du bot, threads supprimés, et la signature de output.send."
  ].filter(Boolean).join("\n\n");

  // envoie un résumé dans le thread d'origine
  try {
    await output.send(`📢 Résumé de l'opération:\n\n${report}`, input.threadID);
  } catch (e) {
    // si impossible d'envoyer le résumé dans le thread d'origine, reply
    await output.reply(report);
  }

  // log complet côté serveur
  console.info("Notification results:", results);
    }

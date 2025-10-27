export const meta = {
    name: "notification",
    otherNames: ["notif", "announce"],
    author: "Christus",
    version: "1.0.0",
    description: "Envoie une notification dans tous les groupes où le bot est présent.",
    usage: "{prefix}notification <message>",
    category: "Admin",
    noPrefix: false,
    permissions: [2], // 2 = bot admin seulement
    botAdmin: true,
    waitingTime: 30, // cooldown en secondes
    ext_plugins: {
        output: "^1.0.0"
    },
    whiteList: null,
    args: [
        {
            degree: 0,
            fallback: null,
            response: "Vous devez fournir un message à envoyer.",
            search: "message",
            required: true
        }
    ],
    supported: "^4.0.0"
};

export async function entry({ input, output, api }) {
    const message = input.arguments.join(" ");
    if (!message) return output.reply("Veuillez fournir un message pour la notification.");

    try {
        const threads = await api.getThreads(); // récupère tous les threads/groupes du bot
        let count = 0;

        for (const thread of threads) {
            await output.send(message, thread.threadID);
            count++;
        }

        output.reply(`✅ Notification envoyée dans ${count} thread(s).`);
    } catch (err) {
        console.error("Erreur lors de l'envoi des notifications:", err);
        output.error("❌ Impossible d'envoyer la notification. Vérifiez les logs.");
    }
}

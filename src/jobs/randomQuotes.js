const cron = require("node-cron");
const { greetingsChannel } = require("../../config.json");
const { EmbedBuilder } = require("discord.js");
const {
  morningQuotes,
  afternoonQuotes,
  nightQuotes,
  eveningQuotes,
} = require("../utils/quotes");

const TIMEZONE = "Asia/Manila";

function schedule(expression, callback) {
  cron.schedule(expression, callback, {
    timezone: TIMEZONE,
  });
}

const CHANNEL_ID = greetingsChannel;

function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function sendQuote(client, title, quotes, color) {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(random(quotes))
      .setFooter({
        text: "Project Zilch • Daily Inspiration",
      })
      .setTimestamp();

    await channel.send({
      embeds: [embed],
    });
  } catch (err) {
    console.error("Quote Scheduler:", err);
  }
}

module.exports = (client) => {
  // 8 PM
  schedule("0 8 * * *", () => {
    sendQuote(client, "Good Morning!", morningQuotes, 0xf3e6ce);
  });

  // 12 PM
  schedule("0 12 * * *", () => {
    sendQuote(client, "Good Afternoon!", afternoonQuotes, 0xffab49);
  });

  // 6 PM
  schedule("0 18 * * *", () => {
    sendQuote(client, "Good Evening!", eveningQuotes, 0x272757);
  });

  // 10PM
  schedule("0 22 * * *", () => {
    sendQuote(client, "Good Night!", nightQuotes, 0x191970);
  });

  console.log("[E:Client Ready] Quote scheduler started.");
};

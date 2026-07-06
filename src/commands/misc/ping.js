module.exports = {
  name: "ping",
  description: "Replies with bot latency and API latency.",
  // devOnly
  // testOnly
  // options

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(
      `Pong! Latency is ${ping}ms. API Latency is ${Math.round(client.ws.ping)}ms`,
    );
  },
};

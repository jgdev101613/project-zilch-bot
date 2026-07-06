module.exports = async (client) => {
  const channelId = "1520302106131566632";
  const channel = await client.channels.fetch(channelId);

  channel.send({
    content: "✅ I am now back online!",
  });
};

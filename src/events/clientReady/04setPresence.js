const { ActivityType } = require("discord.js");

module.exports = (client) => {
  const statuses = [
    {
      type: ActivityType.Listening,
      name: "to music, chill with me",
    },
    {
      type: ActivityType.Listening,
      name: "OPM 🎵",
    },
    {
      type: ActivityType.Watching,
      name: "over Project Zilch",
    },
    {
      type: ActivityType.Playing,
      name: "League Of Legends",
    },
    {
      type: ActivityType.Watching,
      name: `${client.guilds.cache.size} server/s`,
    },
    {
      type: ActivityType.Listening,
      name: `${client.users.cache.size} members`,
    },
  ];

  let index = 0;

  const updateStatus = () => {
    const status = statuses[index];

    client.user.setPresence({
      status: "idle", // online | idle | dnd | invisible
      activities: [
        {
          name: status.name,
          type: status.type,
        },
      ],
    });

    index = (index + 1) % statuses.length;
  };

  updateStatus();

  // Rotate every 5 minutes
  setInterval(updateStatus, 5 * 60 * 1000);

  console.log("[E:Client Ready] Bot presence initialized.");
};

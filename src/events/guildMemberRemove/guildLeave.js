const { Client, GuildMember } = require("discord.js");
const { greetingsChannel } = require("../../../config.json");
/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    const leaveMessages = [
      `**Ayan, may umalis na naman.** Baka hindi niyo kasi in-entertain. 😔`,
      `Si **${member.user.username}** ay nagpaalam... o baka nang-ghost lang. Good luck out there!`,
      `Another one has left the server. Attendance check nga naman.`,
      `**${member.user.username}** has left the server. Respawn nalang ulit pag namiss kami.`,
      `Parang bula... bigla nalang nawala si **${member.user.username}**.`,
      `Server population decreased by one. Sino nanaman nang-asar? 😂`,
      `May umalis... may nag-chat ba sa kanya kahit minsan?`,
      `Exit successful. Ingat sa next adventure, **${member.user.username}**!`,
      `We lost another soldier. Salute kay **${member.user.username}**!`,
      `**${member.user.username}** packed their bags and headed to a new adventure.`,
      `Baka bumalik din 'yan. Alam mo naman... curious lang.`,
      `Ayan na nga ba. Isa na namang hindi kinaya ang trip ng server.`,
      `Farewell, **${member.user.username}**! Thanks for spending time with us.`,
      `Mukhang hindi kami ang "the one." Ingat lagi, **${member.user.username}**!`,
      `**${member.user.username}** has left the chat. GGWP.`,
      `Server cleanup complete. One member checked out.`,
      `Baka napindot lang 'Leave Server'... sana. 😭`,
      `Plot twist: **${member.user.username}** left before unlocking the best moments.`,
      `Tulad ng hangin... dumaan lang si **${member.user.username}**.`,
      `Ayan, may umalis na naman. Di nyo man lang pinigilan.`,
      `**${member.user.username}**, wag ka na babalik!`,
      `**${member.user.username}** alis ng alis, baliw`,
    ];

    const channel = await client.channels.fetch(greetingsChannel);

    if (!channel) return;

    const random = (array) => array[Math.floor(Math.random() * array.length)];
    const leaveMessage = random(leaveMessages);

    channel.send({
      content: leaveMessage,
    });
  } catch (error) {
    console.error("Failed to send welcome messages:", error);
  }
};

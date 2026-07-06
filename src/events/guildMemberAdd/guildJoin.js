const { AttachmentBuilder } = require("discord.js");
const path = require("path");
const { Canvas, loadImage } = require("@napi-rs/canvas");
const {
  greetingsChannel,
  staffNotificationChannel,
  welcomeChannel,
  staffTeamRoleID,
} = require("../../../config.json");

module.exports = async (client, member) => {
  try {
    const CHANNELS = {
      welcome: welcomeChannel,
      staffNotif: staffNotificationChannel,
      greetings: greetingsChannel,
    };

    const STAFF_ROLE_ID = staffTeamRoleID;

    const [channel, greetingChannel, staffNotifChannel] = await Promise.all([
      client.channels.fetch(CHANNELS.welcome),
      client.channels.fetch(CHANNELS.greetings),
      client.channels.fetch(CHANNELS.staffNotif),
    ]);

    if (
      !channel?.isTextBased() ||
      !greetingChannel?.isTextBased() ||
      !staffNotifChannel?.isTextBased()
    ) {
      console.error("One or more configured channels are invalid.");
      return;
    }

    const welcomeMessages = [
      `**Welcome to Project Zilch,** ${member}! Thank you for joining our community. We hope you enjoy your stay!`,
      `✨ **Welcome to Project Zilch!** ${member}, we're delighted to have you with us. Feel free to explore and make yourself at home.`,
      `🎉 **A warm welcome to Project Zilch!** ${member}, we hope this community becomes a place you'll love being part of.`,
      `🚀 **Welcome to Project Zilch,** ${member}! Your journey starts here, and we're glad you've joined us.`,
      `💜 **Welcome!** ${member}, thank you for becoming a part of **Project Zilch**. We hope you have an amazing experience.`,
      `🌟 **Project Zilch welcomes you,** ${member}! We hope you enjoy meeting new people and creating great memories here.`,
      `🎊 **Welcome aboard,** ${member}! Thank you for joining **Project Zilch**. We hope you have a fantastic time.`,
      `🌌 **Welcome to Project Zilch!** ${member}, we're excited to have you here. Take a look around and enjoy the community.`,
      `🎈 **Welcome,** ${member}! We appreciate you joining **Project Zilch** and hope you feel right at home.`,
      `🔥 **Welcome to Project Zilch!** ${member}, thanks for stopping by. We hope you'll enjoy everything our community has to offer.`,
      `💫 **It's great to have you here,** ${member}! Welcome to **Project Zilch**, and enjoy your time with us.`,
      `🎁 **Welcome to Project Zilch,** ${member}! We hope your time here is filled with fun conversations and great experiences.`,
      `🌠 **A new chapter begins!** Welcome to **Project Zilch**, ${member}. We're happy to have you with us.`,
      `🤝 **Welcome!** ${member}, thank you for joining **Project Zilch**. We hope you'll enjoy being part of our growing community.`,
      `🎮 **Welcome to Project Zilch,** ${member}! Explore, connect, and most importantly, have fun!`,
    ];

    const greetingsMessages = [
      `🎉 Everyone welcome ${member}! We're happy to have you in **${member.guild.name}**!`,
      `👋 Hey ${member}, welcome aboard! Hope you enjoy your stay in **${member.guild.name}**.`,
      `🥳 A new challenger appears! Say hello to ${member}!`,
      `✨ ${member} has joined the adventure! Make them feel at home.`,
      `🎊 Welcome ${member}! Don't be shy—jump into the conversation!`,
      `🚀 ${member} just landed in **${member.guild.name}**. Give them a warm welcome!`,
      `🎈 Glad you're here, ${member}! We hope you have an amazing time with us.`,
      `🌟 Everyone, let's welcome ${member}! Read the rules, grab your roles, and have fun!`,
      `💜 It's always exciting to see a new face. Welcome, ${member}!`,
      `🔥 ${member} joined the server! Let's make their first day awesome.`,
      `🎮 ${member} has entered the lobby. Ready to game and chat?`,
      `🍕 Welcome, ${member}! Grab a seat and enjoy your stay.`,
      `🎁 Surprise! We have a new member: ${member}!`,
      `🌈 A warm welcome to ${member}! We hope you'll make lots of new friends here.`,
      `🎆 Let's give a huge welcome to ${member}! Enjoy your time in **${member.guild.name}**!`,
    ];

    const staffMessages = [
      `<@&${STAFF_ROLE_ID}> Please welcome **${member.displayName}** in <#${CHANNELS.greetings}>.`,
      `<@&${STAFF_ROLE_ID}> **${member.displayName}** has just joined! Please stop by <#${CHANNELS.greetings}> and greet them.`,
      `<@&${STAFF_ROLE_ID}> A new member has arrived! Please welcome **${member.displayName}** in <#${CHANNELS.greetings}>.`,
      `<@&${STAFF_ROLE_ID}> **${member.displayName}** is waiting for a warm welcome in <#${CHANNELS.greetings}>.`,
      `<@&${STAFF_ROLE_ID}> Please take a moment to welcome **${member.displayName}** in <#${CHANNELS.greetings}>.`,
    ];

    const random = (array) => array[Math.floor(Math.random() * array.length)];

    const welcomeMessage = random(welcomeMessages);
    const greetingsMessage = random(greetingsMessages);
    const staffMessage = random(staffMessages);

    const attachment = await createWelcomeCard(
      member,
      "./src/assets/welcome/bg1.png",
    );

    await Promise.all([
      channel.send({
        content: welcomeMessage,
        files: [attachment],
      }),

      greetingChannel.send({
        content: greetingsMessage,
      }),

      staffNotifChannel.send({
        content: staffMessage,
        allowedMentions: {
          roles: [STAFF_ROLE_ID],
        },
      }),
    ]);
  } catch (err) {
    console.error("Failed to send welcome messages:", err);
  }
};

async function createWelcomeCard(member, backgroundPath) {
  const canvas = new Canvas(960, 540);
  const ctx = canvas.getContext("2d");

  // Background
  const background = await loadImage(backgroundPath);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;

  // Avatar
  const avatar = await loadImage(
    member.user.displayAvatarURL({
      extension: "png",
      size: 512,
    }),
  );

  // Member Count
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "29.17px Poppins";
  ctx.fillText(`Member #${member.guild.memberCount}`, centerX, 40.5);

  // Welcome
  ctx.font = "72px 'Russo One'";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("WELCOME", centerX, 132.8);

  // Avatar
  const avatarSize = 170;
  const avatarX = centerX - avatarSize / 2;
  const avatarY = 178.2;

  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);

  ctx.closePath();
  ctx.clip();

  ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

  ctx.restore();

  // Border
  ctx.beginPath();
  ctx.arc(
    centerX,
    avatarY + avatarSize / 2,
    avatarSize / 2 + 4,
    0,
    Math.PI * 2,
  );

  ctx.lineWidth = 6;
  ctx.strokeStyle = "#FFFFFF";
  ctx.stroke();

  // Username
  let username = member.user.username;
  let userTag = member.user.globalName ?? member.user.username;

  if (username.length > 18) username = username.slice(0, 18) + "...";

  ctx.font = "42px Poppins";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(username, centerX, 420.9);

  // Usertag
  ctx.font = "30px Poppins";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(userTag, centerX, 457.2);

  return new AttachmentBuilder(await canvas.encode("png"), {
    name: "welcome.png",
  });
}

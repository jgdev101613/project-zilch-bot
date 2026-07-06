module.exports = async (client, message) => {
  if (message.author.bot) return;

  const userMention = message.mentions.users.first() || message.author;
  const messageContent = message.content.toLocaleLowerCase();

  const messages = [
    "hello",
    "hi",
    "hey",
    "sup",
    "yo",
    "cheers",
    "konnichiwa",
    "guten Tag",
    "musta",
    "hoy",
    "kamusta",
    "hii",
    "hiii",
    "hola",
    "hello",
    "cheers",
  ];

  const botReplies = [
    `Hi there ${userMention}! How can I help you today?`,
    `Hello ${userMention}, good to hear from you. I hope you're having a productive week.`,
    `Hi ${userMention}! Just wrapping up a few tasks, but I'm all ears. What's on your mind?`,
    "Hey! What's up? Long time no see.",
    "Yo! How's it going?",
    "Hey there! Glad you reached out. What have you been up to?",
    "Hi hi! Hope you're having a good one.",
    "Yo! Perfect timing, I just booted up. Grab your gear and let's squad up—what are we playing?",
    "Hey! Ready to carry or get carried today? The lobby is open, join my queue.",
    "What's up! We need a solid teammate right now. Drop your username and let's get this win.",

    // Tagalog
    "Ano nanaman?",
    "Baket?",
    "Ano kailangan mo?",
    "oi, musta na si tita?",
    "Yow, online ka pala, tra enum?",
    "G na",
    `${userMention}, puro ka "${messageContent}". G na muna.`,
    "oi?, bat?",
    "musta ka na?",
  ];

  if (messages.includes(messageContent)) {
    const reply = botReplies[Math.floor(Math.random() * botReplies.length)];

    message.channel.sendTyping();
    const delay = Math.floor(Math.random() * 1500) + 700;

    await message.react("❤️");
    setTimeout(() => {
      message.reply(reply);
    }, delay);
  }
};

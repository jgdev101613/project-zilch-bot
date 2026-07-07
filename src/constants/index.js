const COLORS = {
  SUCCESS: 0x57f287, // Discord Green
  ERROR: 0xed4245, // Discord Red
  INFO: 0x5865f2, // Discord Blurple
  WARNING: 0xfee75c, // Discord Yellow
  LEVELUPMESSAGE: 0x57f287,
};

const EMBED_TYPES = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING",
  LEVELUPMESSAGE: "LEVELUPMESSAGE",
};

const DEFAULT_MESSAGES = {
  DEFAULT_LEVEL_MESSAGE: `
    🎉 Congratulations {user}!

    You reached **Level {level}**!
    `,
};

const UPDATE_TYPES = {
  GUILDUPDATE: "Guild Module Update",
  LEVELINGUPDATE: "Leveling Module Update",
  SYNC: "Level Synchronization",
  SETTINGS: "Setting Module Update",
};

const XP_SOURCES = {
  TEXT: "TEXT",
  VOICE: "VOICE",
  DAILY: "DAILY",
  QUEST: "QUEST",
  ADMIN: "ADMIN",
  EVENT: "EVENT",
};

module.exports = {
  COLORS,
  EMBED_TYPES,
  DEFAULT_MESSAGES,
  UPDATE_TYPES,
  XP_SOURCES,
};

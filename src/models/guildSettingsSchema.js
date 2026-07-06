const { Schema, model } = require("mongoose");

const guildSettingsSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  guildName: {
    type: String,
    required: false,
    default: "",
  },

  // ==========================
  // Leveling
  // ==========================
  leveling: {
    enabled: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // Text Leveling
    // ==========================

    text: {
      enabled: {
        type: Boolean,
        default: false,
      },

      minXp: {
        type: Number,
        default: 5,
      },

      maxXp: {
        type: Number,
        default: 15,
      },

      cooldown: {
        type: Number,
        default: 10000,
      },

      xpMultiplier: {
        type: Number,
        default: 1,
      },

      minimumMessageLength: {
        type: Number,
        default: 5,
      },

      ignoredChannels: {
        type: [String],
        default: [],
      },

      ignoredRoles: {
        type: [String],
        default: [],
      },
    },

    // ==========================
    // Voice Leveling
    // ==========================

    voice: {
      enabled: {
        type: Boolean,
        default: false,
      },

      minXp: {
        type: Number,
        default: 15,
      },

      maxXp: {
        type: Number,
        default: 25,
      },

      cooldown: {
        type: Number,
        default: 60000,
      },

      xpMultiplier: {
        type: Number,
        default: 1,
      },

      minimumUsers: {
        type: Number,
        default: 2,
      },

      ignoredChannels: {
        type: [String],
        default: [],
      },

      ignoredRoles: {
        type: [String],
        default: [],
      },

      validation: {
        allowSelfMute: {
          type: Boolean,
          default: true,
        },

        allowSelfDeaf: {
          type: Boolean,
          default: true,
        },

        allowServerMute: {
          type: Boolean,
          default: true,
        },

        allowServerDeaf: {
          type: Boolean,
          default: true,
        },

        allowAfkChannel: {
          type: Boolean,
          default: true,
        },
      },
    },

    // ==========================
    // Shared
    // ==========================

    levelUpMessage: {
      type: String,
      default: null,
    },

    levelUpChannel: {
      type: String,
      default: null,
    },

    rewardStacking: {
      type: Boolean,
      default: true,
    },

    rewardRoles: [
      {
        level: Number,
        roleId: String,
      },
    ],
  },

  // ==========================
  // Settings
  // ==========================
  settings: {
    theme: {
      font: {
        type: String,
        default: "Arial",
      },
      colors: {
        primary: {
          type: String,
          default: "#ff5f03",
        },
        secondary: {
          type: String,
          default: "#ff0000",
        },
        background: {
          type: String,
          default: "#1A1A1A",
        },
        outline: {
          type: String,
          default: "#141414",
        },
        text: {
          type: String,
          default: "#ffffff",
        },
      },
    },
  },
});

module.exports = model("GuildSettings", guildSettingsSchema);

const { Schema, model } = require("mongoose");

const levelSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    guildId: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      default: "",
    },

    avatarURL: {
      type: String,
      default: "",
    },
    xp: {
      type: Number,
      default: 0,
    },
    totalXp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

levelSchema.index({ guildId: 1, userId: 1 }, { unique: true });

levelSchema.index({ guildId: 1, level: -1, xp: -1 });

module.exports = model("Level", levelSchema);

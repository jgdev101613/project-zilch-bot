const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const leaderboardCard = require("../../cards/leaderboardCard");
const getGuildSettings = require("../guildSettings");
const getLeaderboard = require("./getLeaderboard");
const getUserRank = require("./getUserRank");

const LEADERBOARD_CUSTOM_ID_PREFIX = "leaderboard";
const PAGE_SIZE = 10;

const LEADERBOARD_EXPIRE_MS = 10 * 60 * 1000; // 1 minute

function getLeaderboardCustomId(
  ownerId,
  page,
  action = "page",
  expiresAt = Date.now() + LEADERBOARD_EXPIRE_MS,
) {
  return `${LEADERBOARD_CUSTOM_ID_PREFIX}:${ownerId}:${action}:${page}:${expiresAt}`;
}

function parseLeaderboardCustomId(customId) {
  const [prefix, ownerId, action, page, expiresAt] = customId.split(":");

  if (
    prefix !== LEADERBOARD_CUSTOM_ID_PREFIX ||
    !ownerId ||
    !action ||
    !page ||
    !expiresAt
  ) {
    return null;
  }

  return {
    ownerId,
    action,
    page: Math.max(1, Number(page) || 1),
    expiresAt: Number(expiresAt),
  };
}

function createPaginationComponents(
  ownerId,
  currentPage,
  totalPages,
  yourRank,
  expiresAt,
) {
  if (totalPages <= 1) {
    return [];
  }

  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const myPage = yourRank > 0 ? Math.ceil(yourRank / PAGE_SIZE) : currentPage;

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(getLeaderboardCustomId(ownerId, 1, "page", expiresAt))
      .setEmoji("⏮")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(isFirstPage),

    new ButtonBuilder()
      .setCustomId(
        getLeaderboardCustomId(ownerId, previousPage, "page", expiresAt),
      )
      .setEmoji("◀")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(isFirstPage),

    new ButtonBuilder()
      .setCustomId(getLeaderboardCustomId(ownerId, myPage, "me", expiresAt))
      .setEmoji("🏆")
      .setStyle(ButtonStyle.Success)
      .setDisabled(yourRank <= 0 || myPage === currentPage),

    new ButtonBuilder()
      .setCustomId(
        getLeaderboardCustomId(ownerId, currentPage, "page", expiresAt),
      )
      .setLabel(`${currentPage}/${totalPages}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),

    new ButtonBuilder()
      .setCustomId(getLeaderboardCustomId(ownerId, nextPage, "page", expiresAt))
      .setEmoji("▶")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(isLastPage),

    new ButtonBuilder()
      .setCustomId(
        getLeaderboardCustomId(ownerId, totalPages, "page", expiresAt),
      )
      .setEmoji("⏭")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(isLastPage),
  );

  return [row];
}

async function createLeaderboardPayload({ guild, ownerId, page = 1 }) {
  const settings = await getGuildSettings(guild.id);
  const leaderboard = await getLeaderboard(guild.id, page, PAGE_SIZE);
  const yourRank = await getUserRank(guild.id, ownerId);

  const image = await leaderboardCard({
    guildName: guild.name,

    guildIcon: guild.iconURL({
      extension: "png",
      size: 256,
    }),

    currentPage: leaderboard.currentPage,
    totalPages: leaderboard.totalPages,

    pageSize: PAGE_SIZE,

    users: leaderboard.users,

    yourRank,

    theme: settings.settings.theme,
  });

  const expiresAt = Date.now() + LEADERBOARD_EXPIRE_MS;

  return {
    attachments: [],
    files: [
      {
        attachment: image,
        name: "leaderboard.png",
      },
    ],
    components: createPaginationComponents(
      ownerId,
      leaderboard.currentPage,
      leaderboard.totalPages,
      yourRank,
      expiresAt,
    ),
  };
}

module.exports = {
  LEADERBOARD_CUSTOM_ID_PREFIX,
  createLeaderboardPayload,
  parseLeaderboardCustomId,
};

const path = require("path");
const { Canvas, loadImage } = require("@napi-rs/canvas");

// Components
const drawProgressBar = require("./components/drawProgressBar");
const drawAvatar = require("./components/drawAvatar");
const rankData = require("./components/rankData");
const drawUserInformation = require("./components/drawUserInformation");

// Layout
const rankLayout = require("./layouts/rankLayouts");

module.exports = async function generateRankCard(data) {
  const canvas = new Canvas(1000, 300);
  const ctx = canvas.getContext("2d");

  // ==========================
  // Background
  // ==========================

  const background = await loadImage(
    path.join(__dirname, "assets", "backgrounds", "rank-bg.png"),
  );

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  const render = {
    ctx,

    canvas,

    theme: data.theme,

    layout: rankLayout,

    data,
  };

  // ==========================
  // Avatar
  // ==========================

  await drawAvatar(render);

  // ==========================
  // User Information
  // ==========================

  await drawUserInformation(render);

  // ==========================
  // Progress Bar
  // ==========================
  await drawProgressBar(render);

  // ==========================
  // Rank Data
  // ==========================
  await rankData(render);

  return canvas.encode("png");
};

const path = require("path");
const { Canvas, loadImage } = require("@napi-rs/canvas");

const leaderboardLayout = require("./layouts/leaderboardLayout");
const drawLeaderboardFooter = require("./components/drawLeaderboardFooter");
const drawLeaderboardHeader = require("./components/drawLeaderboardHeader");
const drawLeaderboardEntries = require("./components/drawLeaderboardEntries");

module.exports = async function leaderboardCard(data) {
  const canvas = new Canvas(
    leaderboardLayout.canvas.width,
    leaderboardLayout.canvas.height,
  );

  const ctx = canvas.getContext("2d");

  const background = await loadImage(
    path.join(__dirname, "assets", "backgrounds", "leaderboard-bg.png"),
  );

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  const render = {
    ctx,
    canvas,

    data,

    theme: data.theme,

    layout: leaderboardLayout,
  };

  await drawLeaderboardHeader(render);
  await drawLeaderboardEntries(render);
  drawLeaderboardFooter(render);

  return canvas.encode("png");
};

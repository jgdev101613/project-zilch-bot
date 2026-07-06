const fitText = require("../utils/fitText");
/**
 * Draws a rounded progress bar.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options
 */
module.exports = function drawUserInformation(render) {
  const { ctx, data, theme } = render;
  const { displayName, username } = data;
  const { user } = render.layout;

  ctx.fillStyle = "#FFFFFF";

  const nameSize = fitText(ctx, displayName, {
    maxWidth: 600,
    maxSize: 42,
    minSize: 22,
    family: theme.font,
    weight: "bold",
  });

  ctx.fillText(displayName, user.displayName.x, user.displayName.y);

  ctx.fillStyle = "#CFCFCF";

  const usernameSize = fitText(ctx, username, {
    maxWidth: 600,
    maxSize: 28,
    minSize: 14,
    family: theme.font,
    weight: "bold",
  });

  ctx.fillText(`@${username}`, user.username.x, user.username.y);
};

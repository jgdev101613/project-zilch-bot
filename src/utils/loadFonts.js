const path = require("path");
const { GlobalFonts } = require("@napi-rs/canvas");

module.exports = function loadFonts() {
  const fonts = [
    {
      file: "RussoOne-Regular.ttf",
      family: "Russo One",
    },
    {
      file: "Poppins-Regular.ttf",
      family: "Poppins",
    },
  ];

  for (const font of fonts) {
    const success = GlobalFonts.registerFromPath(
      path.join(__dirname, "..", "assets", "fonts", font.file),
      font.family,
    );

    console.log(
      `[Font] Loaded font: ${font.family} (${success ? "Success" : "Failed"})`,
    );
  }
};

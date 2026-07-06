const path = require("path");
const fs = require("fs");

const { REST, Routes } = require("discord.js");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  NoSubscriberBehavior,
  getVoiceConnection,
} = require("@discordjs/voice");

const { testServer, cctvChannel } = require("../../../config.json");

module.exports = async (client) => {
  try {
    const guild = await client.guilds.fetch(testServer);
    if (!guild) throw new Error("[E:Client Ready] Guild not found.");

    const channel = await guild.channels.fetch(cctvChannel);
    if (!channel?.isVoiceBased()) {
      throw new Error("[E:Client Ready]Invalid voice channel.");
    }

    // Destroy existing connection
    const existing = getVoiceConnection(guild.id);

    if (existing) {
      existing.destroy();
    }

    // Join VC
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: true,
    });

    // Wait until ready
    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

    console.log("[E:Client Ready] Connected to voice.");

    // Update VC status
    await setVoiceStatus(client, channel.id, "OPM Music Chill 🎶");

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    connection.subscribe(player);

    const audioPath = path.join(__dirname, "../../assets/song/output.ogg");

    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio not found:\n${audioPath}`);
    }

    function playMusic() {
      const resource = createAudioResource(audioPath, {
        inlineVolume: true,
      });

      resource.volume.setVolume(0.2);

      player.play(resource);
    }

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("[E:Client Ready] Lobby music playing.");
    });

    player.on(AudioPlayerStatus.Idle, playMusic);

    player.on("error", console.error);

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      console.log("[E:Client Ready] Voice disconnected.");

      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);

        console.log("[E:Client Ready] Reconnected.");
      } catch {
        console.log("[E:Client Ready] Connection lost.");

        try {
          await setVoiceStatus(client, channel.id, null);
        } catch {}

        connection.destroy();
      }
    });

    playMusic();
  } catch (err) {
    console.error(err);
  }
};

async function setVoiceStatus(client, channelId, status) {
  const rest = new REST({ version: "10" }).setToken(client.token);

  try {
    await rest.put(Routes.channelVoiceStatus(channelId), {
      body: {
        status,
      },
    });

    console.log(`[E:Client Ready] Voice status: ${status ?? "Cleared"}`);
  } catch (err) {
    console.error("[E:Client Ready] Failed to set voice status:", err);
  }
}

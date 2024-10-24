import { ActivityType } from "discord.js";
import Event from "../../Handlers/Event.js";
import { joinVoiceChannel } from "@discordjs/voice";
import { Logger } from "../../Services/Logger.js";
import Config from "../../Config/Config.js";

export default class extends Event {
  constructor(client) {
    super(client, {
      name: "ready",
    });
  }

  run = async () => {
    this.client.user.presence.set({
      activities: [{ name: "Respondendo @Mention", type: ActivityType.Custom }],
    });

    const channelId = Config.guild_channel_id;
    const channel = this.client.channels.cache.get(channelId);

    if (channel) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      Logger.success(`Joined voice channel: ${channel.name}`);
    } else {
      Logger.error(`Voice channel with ID ${channelId} not found.`);
    }

    await this.client.registerCommands();
    Logger.success(`${this.client.user.tag} is online and ready!`);
  };
}

import Command from "../../Handlers/Command.js";
import { Logger } from "../../Services/Logger.js";
import { join } from "path";
import { promises as fs } from "fs";

export default class extends Command {
  constructor(client) {
    super(client, {
      name: "setlanguage",
      description: "Muda a linguagem do bot.",
      options: [
        {
          name: "language",
          description: "Escolha o idioma (en-US ou pt-BR)",
          type: 3,
          required: true,
          choices: [
            { name: "English", value: "en-US" },
            { name: "Português", value: "pt-BR" },
          ],
        },
      ],
    });
  }

  async run(interaction) {
    const lang = interaction.options.getString("language");
    const serverId = interaction.guild.id;

    // Armazena a linguagem no banco de dados
    await this.client.dbWrapper.updateLanguage(serverId, lang);

    // Carrega os comandos do idioma selecionado
    const langFilePath = join(process.cwd(), `src/locales/${lang}/commands.json`);
    const langData = await fs.readFile(langFilePath, "utf-8");
    const commands = JSON.parse(langData);

    await interaction.reply(commands.language_changed);
  }
}

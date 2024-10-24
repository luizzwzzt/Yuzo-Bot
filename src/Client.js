import { Client, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';
import { pathToFileURL } from 'url';
import { join } from 'path';
import config from './Config/Config.js';
import { Logger } from './Services/Logger.js';
import { DBWrapper } from './Database/Schemas/DBWrapper.js';

class YutzClient extends Client {
	constructor(options) {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
		});

		this.token = options.token || process.env.token || config.token;
		this.commands = [];
		this.dbWrapper = new DBWrapper();
	}

	async loadCommands(path = 'src/Commands') {
		const categories = readdirSync(path);
		for (const category of categories) {
			const commands = readdirSync(`${path}/${category}`);
			for (const command of commands) {
				const commandPath = join(process.cwd(), `${path}/${category}/${command}`);
				const CommandClassModule = await import(pathToFileURL(commandPath).href);
				const CommandClass = CommandClassModule.default;
				const cmd = new CommandClass(this);

				if (!this.commands.some((existingCmd) => existingCmd.name === cmd.name)) {
					this.commands.push(cmd);
				}
			}
		}
	}

	async loadEvents(path = 'src/Events') {
		const categories = readdirSync(path);
		for (const category of categories) {
			const events = readdirSync(`${path}/${category}`);
			for (const event of events) {
				Logger.custom({ name: 'EVENT', options: ['magenta', 'bold'] }, `Loading event: ${event}`);
				const eventPath = join(process.cwd(), `${path}/${category}/${event}`);
				const EventClassModule = await import(pathToFileURL(eventPath).href);
				const EventClass = EventClassModule.default;
				const evt = new EventClass(this);
				this.on(evt.name, evt.run);
			}
		}
	}

	async registerCommands() {
		const commandData = this.commands.map((cmd) => ({
			name: cmd.name,
			description: cmd.description,
			options: cmd.options || [],
			type: 1 
		}));

		try {
			const existingCommands = await this.application.commands.fetch();
			for (const command of existingCommands.values()) {
				if (!commandData.some((cmd) => cmd.name === command.name)) {
					await command.delete();
					Logger.warn(`Removed command: ${command.name}`); 
				}
			}

			await this.application.commands.set(commandData);
			Logger.success(`Commands registered globally successfully`);
		} catch (error) {
			Logger.error('Error registering commands:', error);
		}
	}

	async start() {
		await this.dbWrapper.connect(); 
		await this.loadCommands();
		await this.loadEvents();
		await this.login(this.token);
	}
}

const client = new YutzClient({});
client.start();

import { Server } from '../Database/Schemas/GuildSchema.js';

export async function handleXpSystem(message) {
	const serverId = message.guild.id;
	const userId = message.author.id;
	const userName = message.author.username;
	const serverName = message.guild.name;

	let serverData = await Server.findOne({ serverId });


	if (!serverData) {
			serverData = new Server({
					serverId,
					serverName,
					users: [], 
			});
	}

	if (!serverData.users) {
			serverData.users = [];
	}

	let userData = serverData.users.find((user) => user.userId === userId);

	if (!userData) {
			userData = {
					userId,
					userName,
					xp: 0,
					level: 1,
					nextLevelExp: 100,
			};
			serverData.users.push(userData);
	}

	const xpGive = Math.floor(Math.random() * 5) + 1;
	userData.xp += xpGive;
	console.log(`XP atual do usuário ${userId}: ${userData.xp} (ganhou ${xpGive})`);

	if (userData.xp >= userData.nextLevelExp) {
			userData.level += 1;
			userData.xp = 0; 
			userData.nextLevelExp = Math.floor(userData.nextLevelExp * 1.5); 
			message.reply(`🎉 Parabéns ${message.author}, você subiu para o nível **${userData.level}**!`);
	}

	await serverData.save();
}
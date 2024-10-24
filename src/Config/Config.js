import dotenv from "dotenv";
dotenv.config();

export default {
  prefix: "!",
  owners: ["926250168842588200"],
	guild_channel_id: process.env.guild_channel_id,
  token: process.env.TOKEN,
  mongoURI: process.env.mongoURI
};
import mongoose from 'mongoose';
import { Logger } from '../../Services/Logger.js';
import Config from '../../Config/Config.js';

const serverSchema = new mongoose.Schema({
  serverId: { type: String, required: true, unique: true },
  language: { type: String, default: 'pt-BR' }
});

const Server = mongoose.model('Server', serverSchema);

export class DBWrapper {
  constructor() {
    this.mongoose = mongoose;
  }

  async connect() {
    try {
      await this.mongoose.connect(Config.mongoURI);
      Logger.custom({ name: 'MONGODB', options: ['cyan', 'bold'] }, 'Database connected successfully');
    } catch (error) {
      Logger.error('Failed to connect to the database:', error);
    }
  }

  async updateLanguage(serverId, lang) {
    try {
      await Server.findOneAndUpdate(
        { serverId: serverId },
        { language: lang },
        { upsert: true }
      );
      Logger.success(`Updated language to ${lang} for server ${serverId}`);
    } catch (error) {
      Logger.error(`Failed to update language for server ${serverId}:`, error);
    }
  }

	async getLanguage(serverId) {
    try {
        const serverData = await Server.findOne({ serverId });
        return serverData ? serverData.language : 'pt-BR'; 
    } catch (error) {
        Logger.error(`Failed to get language for server ${serverId}:`, error);
        return 'pt-BR';
    }
}
}

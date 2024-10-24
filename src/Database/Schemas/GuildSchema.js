import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  serverId: { type: String, required: true, unique: true },
  language: { type: String, default: 'pt' }, 
});

export const Server = mongoose.model('Server', serverSchema);

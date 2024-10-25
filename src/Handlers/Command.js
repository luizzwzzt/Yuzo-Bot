export default class Command {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.description = options.description;
    this.options = options.options;
    this.requireDatabase = options.requireDatabase;
    this.ownerOnly = options.ownerOnly || false; 
    this.cooldown = options.cooldown || null; 
    this.permissions = options.permissions || [];
  }
}

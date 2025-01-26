const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

class Migration {
  constructor() {
    this.migrationsPath = path.join(__dirname, '.');
    this.connection = null;
  }

  async connect() {
    await mongoose.connect(process.env.MONGO_URI);
    this.connection = mongoose.connection;
  }

  async run() {
    try {
      await this.connect();
      await this.connection.db.collection('migrations').createIndex({ name: 1 }, { unique: true });
      const files = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.js') && file !== 'migrate.js')
        .sort();

      for (const file of files) {
        const migration = require(path.join(this.migrationsPath, file));
        const exists = await this.connection.db.collection('migrations')
          .findOne({ name: file });

        if (!exists) {
          console.log(`Running migration: ${file}`);
          await migration.up(this.connection);
          await this.connection.db.collection('migrations')
            .insertOne({ name: file, timestamp: new Date() });
          console.log(`Migration ${file} completed successfully`);
        }
      }
    } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    } finally {
      mongoose.connection.close();
    }
  }
}

module.exports = Migration;

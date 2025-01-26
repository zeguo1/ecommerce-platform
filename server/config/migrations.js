module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: "migrations",
  migrationFileExtension: ".js",
  changelogCollectionName: "migrations"
};

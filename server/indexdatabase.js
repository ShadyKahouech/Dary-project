const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config/config.json");

// Initialize Sequelize instance first
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: "localhost",
  dialect: "mysql",
});

// Import models
const User = require("./model/user")(sequelize, DataTypes);
const Prestataire = require("./model/prestataire")(sequelize, DataTypes);
const Request = require("./model/request")(sequelize, DataTypes);
const Availability = require("./model/availability")(sequelize, DataTypes);

// Define associations
User.hasMany(Request, { foreignKey: "userId", onDelete: "CASCADE" });
Request.belongsTo(User, { foreignKey: "userId" });

Prestataire.hasMany(Request, { foreignKey: "driverId", onDelete: "CASCADE" });
Request.belongsTo(Prestataire, { foreignKey: "driverId" });

Prestataire.hasMany(Availability, {
  foreignKey: "prestataireId",
  onDelete: "CASCADE",
});
Availability.belongsTo(Prestataire, { foreignKey: "prestataireId" });

// Now use sequelize to authenticate and sync the database
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully"))
  .catch((error) => console.log("Unable to connect to the database", error));

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database and tables created successfully");
  })
  .catch((error) => {
    console.log(error, "Error syncing the database");
  });

// Export Sequelize and sequelize instance
module.exports = {
  Sequelize,
  sequelize,
  User,
  Prestataire,
};

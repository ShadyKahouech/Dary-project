const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config/config.json");

// Initialize Sequelize instance first
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: "localhost",
  dialect: "mysql",
});

//Import models
const User = require("./model/user")(sequelize, DataTypes);
const Prestataire = require("./model/prestataire")(sequelize, DataTypes);

const Request = require("./model/request")(sequelize, DataTypes);
const Service = require("./model/service")(sequelize, DataTypes);
const Rating = require("./model/rating")(sequelize, DataTypes);
const Availability = require("./model/availability")(sequelize, DataTypes);

// Define relationships
// 1. User-Request relationship
User.hasMany(Request, { foreignKey: "userId", onDelete: "CASCADE" });
Request.belongsTo(User, { foreignKey: "userId" });

// 2. Prestataire-Request relationship
Prestataire.hasMany(Request, {
  foreignKey: "prestataireId",
  onDelete: "CASCADE",
});
Request.belongsTo(Prestataire, { foreignKey: "prestataireId" });

// 3. Prestataire-Availability relationship
Prestataire.hasMany(Availability, {
  foreignKey: "prestataireId",
  onDelete: "CASCADE",
});
Availability.belongsTo(Prestataire, { foreignKey: "prestataireId" });
// 4. Service-Request relationship
Service.hasMany(Request, { foreignKey: "serviceId", onDelete: "SET NULL" });
Request.belongsTo(Service, { foreignKey: "serviceId" });

// 5. User-Rating relationship
User.hasMany(Rating, { foreignKey: "userId", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "userId" });

// 6. Prestataire-Rating relationship
Prestataire.hasMany(Rating, {
  foreignKey: "prestataireId",
  onDelete: "CASCADE",
});
Rating.belongsTo(Prestataire, { foreignKey: "prestataireId" });

// 7. Request-Rating relationship
Request.hasOne(Rating, { foreignKey: "requestId", onDelete: "CASCADE" });
Rating.belongsTo(Request, { foreignKey: "requestId" });

// Sync database and authenticate connection

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

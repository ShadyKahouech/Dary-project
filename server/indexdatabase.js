const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config/config.json");

// Initialize Sequelize instance first
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: "localhost",
  dialect: "mysql",
});

// Now require the User model, passing sequelize and DataTypes
const User = require("./model/user")(sequelize, DataTypes);

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
};

// const prestataire = require("./prestataire");

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    "request",
    {
      requestId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      PresenceAscenceur: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      // The longitude and latitude are gps coordinates
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("pending", "accepted", "refused", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },

      helper: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 6,
        },
      },
      truck_type: {
        type: DataTypes.ENUM(
          "fourgon",
          "grand fourgon",
          "petit camion",
          "grand camion"
        ),
        allowNull: false,
      },
      property_type: {
        type: DataTypes.ENUM("house", "apartment"),
        allowNull: false,
      },

      floor_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      adress: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      userId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      itemsDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      prestataireId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
    },
    {
      tableName: "requests",
      timestamps: true,
    }
  );
  return Request;
};

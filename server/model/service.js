module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
    {
      serviceId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      serviceName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [10, 1000], // Minimum 10 characters, maximum 1000 characters
        },
      },
    },
    {
      tableName: "services",
      timestamps: true,
    }
  );

  return Service;
};

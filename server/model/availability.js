module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define(
    "Availability",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "available",
      },
    },
    {
      tableName: "Availability",
      timestamps: true,
    }
  );

  return Availability;
};

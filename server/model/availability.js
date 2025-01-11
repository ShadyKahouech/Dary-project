module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define(
    "Availability",
    {
      availabilityId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "availabilities",
      timestamps: true,
    }
  );

  return Availability;
};

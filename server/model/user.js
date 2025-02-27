module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: { name: "email_unique", msg: "Email must be unique" },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      role: {
        type: DataTypes.ENUM("utilisateur", "admin"),
        allowNull: false,
        defaultValue: "utilisateur",
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      tableName: "User",
      timestamps: true,
    }
  );
  return User;
};

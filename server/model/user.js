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
        unique: { name: "email_unique", msg: "Email must be unique" }, // Use a named constraint
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
      image: {
        type: DataTypes.STRING,
        allowNull: true, // Optional image
        validate: {
          isUrl: true, // Validates that the image is a URL
        },
      },
    },
    {
      tableName: "User", // Custom table name
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  );
  return User;
};

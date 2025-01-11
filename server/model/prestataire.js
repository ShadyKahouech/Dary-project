module.exports = (sequelize, DataTypes) => {
  const Prestataire = sequelize.define(
    "Prestataire",
    {
      prestataireId: {
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
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      photoOfCin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photoOfDriverLicence: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carteGrise: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(
          "Déménagement",
          "Plomberie",
          "Ménage",
          "Bricolage",
          "prestataire"
        ),
        allowNull: false,
        defaultValue: "prestataire",
      },
      experience: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "Prestataire",
      timestamps: true,
    }
  );

  return Prestataire;
};

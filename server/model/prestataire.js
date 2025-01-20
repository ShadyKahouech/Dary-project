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
        validate: {
          len: [8, 128], // Minimum 8 characters, max 128
        },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [8, 15], // Adjust based on your region
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
      image: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      images_truck: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
          isArrayOfImages(value) {
            if (Array.isArray(value)) {
              if (value.length > 3) {
                throw new Error("You can only upload up to 3 images.");
              }
              value.forEach((url) => {
                if (typeof url !== "string") {
                  throw new Error("Each image URL must be a string.");
                }
              });
            } else {
              throw new Error("Images must be an array.");
            }
          },
        },
      },
      photoOfCin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photoOfDriverLicence: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      carteGrise: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("Déménageur", "Plomberie", "Ménage", "Bricolage"),
        allowNull: false,
        defaultValue: "Déménageur",
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
      experience: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discountedPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "Prestataire",
      timestamps: true,
    }
  );

  return Prestataire;
};

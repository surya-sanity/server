module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("book", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pageCount: {
      type: DataTypes.STRING,
    },
    publishedDate: {
      type: DataTypes.DATE,
    },
    thumbnailUrl: {
      type: DataTypes.TEXT("long"),
    },
    shortDescription: {
      type: DataTypes.TEXT("long"),
    },
    longDescription: {
      type: DataTypes.TEXT("long"),
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
    },
    pricePerDay: {
      type: DataTypes.FLOAT,
    },
    price: {
      type: DataTypes.FLOAT,
    },
  });

  return Book;
};

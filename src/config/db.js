
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  }
);

module.exports = sequelize;

/*
const mongoose = require("mongoose");

const MONGO_URL = `${process.env.MONGO_CONNECTION_STRING}/${process.env.MONGO_DB_NAME}`;
console.log("MONGO_URL:", MONGO_URL);

async function connectDb() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Successful connection to MongoDb");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDb;
*/
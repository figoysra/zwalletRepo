require("dotenv").config();

const env = {
    DB_USERNAME : process.env.DB_USERNAME,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_HOST     : process.env.DB_HOST,
    DB_NAME     : process.env.DB_NAME,
    PORT        : process.env.PORT,
    JWT_SECRET  : process.env.JWT_SECRET
};
module.exports = env
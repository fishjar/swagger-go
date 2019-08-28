import Sequelize from "sequelize";
import config from "../config";

const { DATABASE_URL, DATABASE_OPT } = config;
const sequelize = new Sequelize(DATABASE_URL, DATABASE_OPT);

export default sequelize;

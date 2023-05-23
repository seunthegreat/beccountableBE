require('dotenv').config();

const ROLES_LIST = {
  "Admin": process.env.ADMIN,
  "Creator": process.env.CREATOR,
  "User": process.env.USER
};

module.exports = ROLES_LIST

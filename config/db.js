const {Pool} = require("pg");

const pool = new Pool({connectionString:process.env.database_url});

module.exports = pool;
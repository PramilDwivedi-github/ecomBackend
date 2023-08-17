const seq = require("sequelize");

const db = new seq(
    "pramilgdp",
    "pramil",
    "udfUyeIQPeTGgQ7pTRBGSFz2pCMiLUDO",
    {
      host: "dpg-cjest6ue546c738qf750-a.singapore-postgres.render.com",
      dialect: "postgres",
      port: 5432,
      dialectOptions: {  ssl: true,
        native:true},
    }
  );
module.exports = db;

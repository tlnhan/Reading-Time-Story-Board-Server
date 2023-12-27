const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.Team = async (req, res) => {
  try {
    const pool = await mssql.connect(connectDatabase);

    const result = await pool.request().execute("sp_Team");

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ message: "Not found materials." });
    }
  } catch (error) {
    console.log(error);
  }
};

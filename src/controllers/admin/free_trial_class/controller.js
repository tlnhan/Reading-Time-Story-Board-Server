const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.FreeTrialClass = async (req, res) => {
  try {
    const pool = await mssql.connect(connectDatabase);

    const result = await pool.request().execute("sp_Free_Trial_Class");

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ message: "Not found materials." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

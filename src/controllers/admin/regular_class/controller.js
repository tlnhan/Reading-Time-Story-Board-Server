const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.RegularClass = async (req, res) => {
  try {
    const pool = await mssql.connect(connectDatabase);

    const result = await pool.request().execute("sp_Regular_Class");

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

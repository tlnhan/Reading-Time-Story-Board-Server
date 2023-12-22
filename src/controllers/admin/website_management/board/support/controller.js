const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.BoardSupport = async (req, res) => {
  try {
    const {
      Action,
      Id,
      _Name,
      Email,
      Category,
      Title,
      _Status,
      _Time,
      _Description,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("_Name", mssql.NVarChar(50), _Name)
      .input("Email", mssql.VarChar(50), Email)
      .input("Category", mssql.VarChar(50), Category)
      .input("Title", mssql.VarChar(50), Title)
      .input("_Status", mssql.Bit, _Status)
      .input("_Time", mssql.DateTime, _Time)
      .input("_Description", mssql.NVarChar(mssql.MAX), _Description)
      .execute("sp_Manage_Board_Support");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "POST") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: `Resource created successfully.` });
      } else {
        res.status(500).json({ message: `Failed to create resource.` });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.AssignmentStatus = async (req, res) => {
  try {
    const { Action, Type, Title, Contents } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Type", mssql.VarChar(50), Type)
      .input("Title", mssql.VarChar(50), Title)
      .input("Contents", mssql.NVarChar(mssql.MAX), Contents)
      .execute("sp_Assignment_Status_Teacher");

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

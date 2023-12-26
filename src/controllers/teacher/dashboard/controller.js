const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.DashboardTeacher = async (req, res) => {
  try {
    const { Action, TeacherName } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("TeacherName", mssql.VarChar(50), TeacherName)
      .execute("sp_Dashboard_Teacher");

    if (Action === "POINT") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "ISSUE") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "TODAY") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.WorkingHours = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Team,
      Team_Leader,
      Teacher,
      Teacher_NickName,
      Today,
      Start_Time,
      End_Time,
      Date
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Team", mssql.VarChar(50), Team)
      .input("Team_Leader", mssql.VarChar(50), Team_Leader)
      .input("Teacher", mssql.VarChar(50), Teacher)
      .input("Teacher_NickName", mssql.VarChar(50), Teacher_NickName)
      .input("Today", mssql.NVarChar(10), Today)
      .input("Start_Time", mssql.Time, Start_Time)
      .input("End_Time", mssql.Time, End_Time)
      .input("Date", mssql.Date, Date)
      .execute("sp_Working_Hours");

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
    } else if (Action === "PUT") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: `Resource updated successfully.` });
      } else {
        res.status(500).json({ message: `Failed to update resource.` });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

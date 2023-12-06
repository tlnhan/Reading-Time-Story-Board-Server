const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.VacationAndResignationManagement = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Absence_Request,
      Vacation_Request,
      Retirement_Request,
      Name,
      Team_Leader,
      Tl_Confirm,
      Director_Name,
      Director_Confirm,
      Title,
      Day,
      Period,
      Prove,
      Reasons
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Absence_Request", mssql.Bit, Absence_Request)
      .input("Vacation_Request", mssql.Bit, Vacation_Request)
      .input("Retirement_Request", mssql.Bit, Retirement_Request)
      .input("Name", mssql.VarChar(50), Name)
      .input("Team_Leader", mssql.VarChar(50), Team_Leader)
      .input("Tl_Confirm", mssql.Bit, Tl_Confirm)
      .input("Director_Name", mssql.VarChar(50), Director_Name)
      .input("Director_Confirm", mssql.Bit, Director_Confirm)
      .input("Title", mssql.VarChar(50), Title)
      .input("Day", mssql.Int, Day)
      .input("Period", mssql.VarChar(50), Period)
      .input("Prove", mssql.VarChar(50), Prove)
      .input("Reasons", mssql.VarChar(250), Reasons)
      .execute("sp_Vacation_And_Resignation_Management");

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

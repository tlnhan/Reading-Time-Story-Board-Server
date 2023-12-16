const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");

exports.HolidayManagement = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Name,
      Start_Date,
      End_Date,
      Annual_Repeat,
      Usage_Status,
      Registration_Date,
      Country,
      Search_Year,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Name", mssql.VarChar(20), Name)
      .input("Start_Date", mssql.DateTime, Start_Date)
      .input("End_Date", mssql.DateTime, End_Date)
      .input("Annual_Repeat", mssql.Bit, Annual_Repeat)
      .input("Usage_Status", mssql.Bit, Usage_Status)
      .input("Registration_Date", mssql.DateTime, Registration_Date)
      .input("Country", mssql.VarChar(50), Country)
      .input("Search_Year", mssql.Int, Search_Year)
      .execute("sp_Holiday_Management");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "POST") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: "Resource created successfully." });
      } else {
        res.status(500).json({ message: "Failed to created resource." });
      }
    } else if (Action === "PUT") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: "Resource updated successfully." });
      } else {
        res.status(500).json({ message: "Failed to update resource." });
      }
    } else if (Action === "DELETE") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: "Resource deleted successfully." });
      } else {
        res.status(500).json({ message: "Failed to deleted resource." });
      }
    } else if (Action === "SEARCH") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res
          .status(404)
          .json({ message: "No records found for the specified year." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

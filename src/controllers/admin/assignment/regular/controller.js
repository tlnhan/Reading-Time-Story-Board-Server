const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");

exports.AssignmentRegular = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Student_Name,
      English_Name,
      Product_Name,
      _Start,
      _End,
      Class_Per_Week,
      Class_Start_Date,
      Count_Total,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Student_Name", mssql.VarChar(50), Student_Name)
      .input("English_Name", mssql.VarChar(50), English_Name)
      .input("Product_Name", mssql.VarChar(50), Product_Name)
      .input("_Start", mssql.DateTime, _Start)
      .input("_End", mssql.DateTime, _End)
      .input("Class_Per_Week", mssql.VarChar(50), Class_Per_Week)
      .input("Class_Start_Date", mssql.DateTime, Class_Start_Date)
      .input("Count_Total", mssql.VarChar(50), Count_Total)
      .execute("sp_Assignment_Regular");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
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

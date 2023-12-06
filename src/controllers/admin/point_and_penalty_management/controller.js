const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.PointAndPenaltyManagement = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Teacher,
      Division,
      Item,
      Comment
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
        .input("Teacher", mssql.VarChar(50), Teacher)
        .input("Division", mssql.VarChar(50), Division)
        .input("Item", mssql.VarChar(50), Item)
        .input("Comment", mssql.VarChar(250), Comment)
      .execute("sp_Point_And_Penalty_Management");

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

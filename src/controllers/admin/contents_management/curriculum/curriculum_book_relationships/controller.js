const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.CurriculumBookRelationships = async (req, res) => {
  try {
    const { Action, CurriculumId, BookId } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("CurriculumId", mssql.Int, CurriculumId)
      .input("BookId", mssql.Int, BookId)
      .execute("sp_Curriculum_Book_Relationships");

    if (Action === "LIST") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "ADD") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: `Resource created successfully.` });
      } else {
        res.status(500).json({ message: `Failed to create resource.` });
      }
    } else if (Action === "REMOVE") {
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

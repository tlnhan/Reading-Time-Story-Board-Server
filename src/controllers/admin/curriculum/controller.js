const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.CurriculumContents = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Unique_No,
      Curriculum_Title,
      Subtitle,
      Description,
      Division,
      Whether_To_Use,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Unique_No", mssql.VarChar(50), Unique_No)
      .input("Curriculum_Title", mssql.VarChar(50), Curriculum_Title)
      .input("Subtitle", mssql.VarChar(50), Subtitle)
      .input("Description", mssql.VarChar(mssql.MAX), Description)
      .input("Division", mssql.VarChar(50), Division)
      .input("Whether_To_Use", mssql.Bit, Whether_To_Use)
      .execute("sp_Curriculum_Contents");

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

const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.BookContents = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Book_Title,
      Subtitle,
      Genre,
      Grade,
      Lexile,
      _Page,
      Vocabulary,
      Registration_Date,
      Whether_To_Use,
      Summary_Synopsis,
      Class_Goal,
      Level,
      Cover_Image,
      Attachments,
      Brief_Description,
      Page,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Book_Title", mssql.VarChar(50), Book_Title)
      .input("Subtitle", mssql.VarChar(50), Subtitle)
      .input("Genre", mssql.VarChar(50), Genre)
      .input("Grade", mssql.VarChar(50), Grade)
      .input("Lexile", mssql.VarChar(50), Lexile)
      .input("_Page", mssql.VarChar(50), _Page)
      .input("Vocabulary", mssql.VarChar(50), Vocabulary)
      .input("Registration_Date", mssql.DateTime, Registration_Date)
      .input("Whether_To_Use", mssql.VarChar(50), Whether_To_Use)
      .input("Summary_Synopsis", mssql.VarChar(50), Summary_Synopsis)
      .input("Class_Goal", mssql.VarChar(50), Class_Goal)
      .input("Level", mssql.VarChar(50), Level)
      .input("Cover_Image", mssql.VarChar(50), Cover_Image)
      .input("Attachments", mssql.VarChar(50), Attachments)
      .input("Brief_Description", mssql.VarChar(50), Brief_Description)
      .input("Page", mssql.VarChar(50), Page)
      .execute("sp_Book_Contents");

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

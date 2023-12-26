const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");

exports.RegularClassTeacher = async (req, res) => {
  try {
    const {
      Title,
      Today_Class,
      Book_Name,
      Pages,
      Genre,
      Grade_Level,
      Book_Level,
      Objective,
      Of_Words,
      Lexile_Level,
      Summary,
      Book_Reading,
      MisproNo_unced_World,
      Reading_Aloud,
      Comprehesion,
      Overall_Score,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Title", mssql.VarChar(50), Title)
      .input("Today_Class", mssql.Int, Today_Class)
      .input("Book_Name", mssql.VarChar(50), Book_Name)
      .input("Pages", mssql.VarChar(50), Pages)
      .input("Genre", mssql.VarChar(50), Genre)
      .input("Grade_Level", mssql.VarChar(50), Grade_Level)
      .input("Book_Level", mssql.VarChar(50), Book_Level)
      .input("Objective", mssql.VarChar(50), Objective)
      .input("Of_Words", mssql.VarChar(50), Of_Words)
      .input("Lexile_Level", mssql.VarChar(50), Lexile_Level)
      .input("Summary", mssql.VarChar(50), Summary)
      .input("Book_Reading", mssql.VarChar(50), Book_Reading)
      .input("MisproNo_unced_World", mssql.Int, MisproNo_unced_World)
      .input("Reading_Aloud", mssql.Int, Reading_Aloud)
      .input("Comprehesion", mssql.Int, Comprehesion)
      .input("Overall_Score", mssql.VarChar(50), Overall_Score)
      .execute("sp_Request_Regular_Class_Teacher");

    if (result.returnValue === 0) {
      res.status(200).json({ message: `Resource created successfully.` });
    } else {
      res.status(500).json({ message: `Failed to create resource.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

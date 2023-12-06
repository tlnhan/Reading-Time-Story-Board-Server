const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");

exports.AccountTeacher = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Teacher_Name,
      Nick_Name,
      Email,
      Password,
      Gender,
      Birth,
      Country,
      Timezone,
      Contract_Type,
      Contract,
      Start_Date,
      Resignation_Day,
      Career,
      Using_The_Editor,
      Certificate,
      Resume,
      Status,
      Level,
      Special_Feature,
      Self_Introduction,
      Recommended_Student,
      Recommended_Level,
      Character,
      Lesson_Style,
      Video,
      Student_Review,
      Comment,
      Image,
      Team,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Teacher_Name", mssql.VarChar(50), Teacher_Name)
      .input("Nick_Name", mssql.VarChar(50), Nick_Name)
      .input("Email", mssql.VarChar(50), Email)
      .input("Password", mssql.VarChar(50), Password)
      .input("Gender", mssql.Bit, Gender)
      .input("Birth", mssql.DateTime, Birth)
      .input("Country", mssql.VarChar(50), Country)
      .input("Timezone", mssql.VarChar(50), Timezone)
      .input("Contract_Type", mssql.VarChar(50), Contract_Type)
      .input("Contract", mssql.VarChar(50), Contract)
      .input("Start_Date", mssql.DateTime, Start_Date)
      .input("Resignation_Day", mssql.DateTime, Resignation_Day)
      .input("Career", mssql.VarChar(50), Career)
      .input("Using_The_Editor", mssql.VarChar(50), Using_The_Editor)
      .input("Certificate", mssql.VarChar(mssql.MAX), Certificate)
      .input("Resume", mssql.VarChar(mssql.MAX), Resume)
      .input("Status", mssql.VarChar(50), Status)
      .input("Level", mssql.VarChar(50), Level)
      .input("Special_Feature", mssql.VarChar(50), Special_Feature)
      .input("Self_Introduction", mssql.VarChar(mssql.MAX), Self_Introduction)
      .input("Recommended_Student", mssql.VarChar(50), Recommended_Student)
      .input("Recommended_Level", mssql.VarChar(50), Recommended_Level)
      .input("Character", mssql.VarChar(50), Character)
      .input("Lesson_Style", mssql.VarChar(50), Lesson_Style)
      .input("Video", mssql.VarChar(50), Video)
      .input("Student_Review", mssql.VarChar(50), Student_Review)
      .input("Comment", mssql.VarChar(50), Comment)
      .input("Image", mssql.VarChar(50), Image)
      .input("Team", mssql.VarChar(50), Team)
      .execute("sp_Account_Teacher");

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
        res.status(500).json({ message: "Failed to create resource." });
      }
    } else if (Action === "PUT") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: "Resource updated successfully." });
      } else {
        res.status(500).json({ message: "Failed to update resource." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

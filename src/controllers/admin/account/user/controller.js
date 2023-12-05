const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");

exports.AccountUser = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Status,
      Country,
      Member,
      Email,
      Password,
      User_Name,
      User_English_Name,
      Gender,
      Birth,
      Phone,
      Registration_Date,
      Recent_Login,
      Description,
      Image,
      Admission,
      Tags,
      Referral_Code,
      Signup_path,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Status", mssql.VarChar(50), Status)
      .input("Country", mssql.VarChar(50), Country)
      .input("Member", mssql.VarChar(50), Member)
      .input("Email", mssql.VarChar(50), Email)
      .input("Password", mssql.VarChar(50), Password)
      .input("User_Name", mssql.VarChar(50), User_Name)
      .input("User_English_Name", mssql.VarChar(50), User_English_Name)
      .input("Gender", mssql.Bit, Gender)
      .input("Birth", mssql.DateTime, Birth)
      .input("Phone", mssql.VarChar(20), Phone)
      .input("Registration_Date", mssql.DateTime, Registration_Date)
      .input("Recent_Login", mssql.DateTime, Recent_Login)
      .input("Description", mssql.NVarChar(250), Description)
      .input("Image", mssql.VarChar(50), Image)
      .input("Admission", mssql.VarChar(50), Admission)
      .input("Tags", mssql.VarChar(50), Tags)
      .input("Referral_Code", mssql.VarChar(50), Referral_Code)
      .input("Signup_path", mssql.VarChar(50), Signup_path)
      .execute("sp_Account_User");

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
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.RoleManagement = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Approval,
      Role,
      Country,
      Name,
      Email,
      Password,
      Phone,
      Registration_Date,
      Recent_Login,
      Gender,
      Nickname,
      Birth,
      Contract_Type,
      Contract,
      Start_Date,
      Authority_Type,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Approval", mssql.VarChar(50), Approval)
      .input("Role", mssql.VarChar(50), Role)
      .input("Country", mssql.VarChar(50), Country)
      .input("Name", mssql.VarChar(20), Name)
      .input("Email", mssql.VarChar(50), Email)
      .input("Password", mssql.VarChar(50), Password)
      .input("Phone", mssql.Int, Phone)
      .input("Registration_Date", mssql.DateTime, Registration_Date)
      .input("Recent_Login", mssql.DateTime, Recent_Login)
      .input("Gender", mssql.Bit, Gender)
      .input("Nickname", mssql.VarChar(50), Nickname)
      .input("Birth", mssql.DateTime, Birth)
      .input("Contract_Type", mssql.VarChar(50), Contract_Type)
      .input("Contract", mssql.VarChar(50), Contract)
      .input("Start_Date", mssql.DateTime, Start_Date)
      .input("Authority_Type", mssql.VarChar(50), Authority_Type)
      .execute("sp_Role_Management");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "DETAIL") {
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
    } else if (Action === "SEARCH") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ message: "Not found materials." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

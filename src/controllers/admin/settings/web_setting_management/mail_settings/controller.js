const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.MailSettings = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Email_Sending_Address,
      Email_Receiving_Address,
      Content,
      Upload_Email_Template,
      SMTP_Host,
      SMTP_Port,
      SMTP_Security,
      SMTP_Authentication_Required,
      SMTP_User_Id,
      SMTP_User_Password,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Email_Sending_Address", mssql.NVarChar(50), Email_Sending_Address)
      .input(
        "Email_Receiving_Address",
        mssql.NVarChar(50),
        Email_Receiving_Address
      )
      .input("Content", mssql.VarChar(255), Content)
      .input("Upload_Email_Template", mssql.VarChar(50), Upload_Email_Template)
      .input("SMTP_Host", mssql.NVarChar(50), SMTP_Host)
      .input("SMTP_Port", mssql.Int, SMTP_Port)
      .input("SMTP_Security", mssql.NVarChar(50), SMTP_Security)
      .input(
        "SMTP_Authentication_Required",
        mssql.Bit,
        SMTP_Authentication_Required
      )
      .input("SMTP_User_Id", mssql.NVarChar(50), SMTP_User_Id)
      .input("SMTP_User_Password", mssql.NVarChar(50), SMTP_User_Password)
      .execute("sp_Mail_Settings");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
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

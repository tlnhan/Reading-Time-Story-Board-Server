const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.MailSettings = async (req, res) => {
  try {
    const { Action, Mail_Settings_Id, Email_Sending_Address, Email_Receiving_Address } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Mail_Settings_Id", mssql.Int, Mail_Settings_Id)
      .input("Email_Sending_Address", mssql.NVarChar(50), Email_Sending_Address)
      .input("Email_Receiving_Address", mssql.NVarChar(50), Email_Receiving_Address)
      .input("Content", mssql.VarChar(255), Email_Receiving_Address)
      .execute("sp_Mail_Settings");

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
    } else if (Action === "DELETE") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: "Resource deleted successfully." });
      } else {
        res.status(500).json({ message: "Failed to delete resource." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

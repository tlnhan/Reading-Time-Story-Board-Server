const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.SMSSettings = async (req, res) => {
  try {
    const {
      Action,
      Id,
      API_Key,
      API_Secret,
      Sender_Number,
      Sender_Id,
      Send_SMS_Failure,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("API_Key", mssql.VarChar(250), API_Key)
      .input("API_Secret", mssql.VarChar(250), API_Secret )
      .input("Sender_Number", mssql.Int, Sender_Number)
      .input("Sender_Id", mssql.VarChar(250), Sender_Id)
      .input("Send_SMS_Failure", mssql.Bit, Send_SMS_Failure)
      .execute("sp_SMS_Settings");

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

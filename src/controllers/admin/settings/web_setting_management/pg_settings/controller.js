const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.PGSettings = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Merchant_Indentification_Code,
      API_Key,
      API_Secret,
      Regular_Payment_Merchant_Id,
      PG_Provider,
      Webhook_Url,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input(
        "Merchant_Indentification_Code",
        mssql.VarChar(50),
        Merchant_Indentification_Code
      )
      .input("API_Key", mssql.VarChar(50), API_Key)
      .input("API_Secret", mssql.VarChar(50), API_Secret)
      .input(
        "Regular_Payment_Merchant_Id",
        mssql.VarChar(50),
        Regular_Payment_Merchant_Id
      )
      .input("PG_Provider", mssql.VarChar(50), PG_Provider)
      .input("Webhook_Url", mssql.VarChar(50), Webhook_Url)
      .execute("sp_PG_Settings");

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

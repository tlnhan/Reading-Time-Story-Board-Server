const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.PromotionTermsAndConditions = async (req, res) => {
  try {
    const { Action, Id, Title, Text_Field, Country } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Title", mssql.VarChar(50), Title)
      .input("Text_Field", mssql.VarChar(250), Text_Field)
      .input("Country", mssql.VarChar(50), Country)
      .execute("sp_Promotion_Terms_And_Conditions");

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

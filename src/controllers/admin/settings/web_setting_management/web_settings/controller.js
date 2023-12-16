const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.WebSettings = async (req, res) => {
  try {
    const { Action, Id, Title, Tagline } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.NVarChar(200), Action)
      .input("Id", mssql.Int, Id)
      .input("Title", mssql.NVarChar(50), Title)
      .input("Tagline", mssql.NVarChar(50), Tagline)
      .execute("sp_Web_Settings");

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
        res.status(400).json({ message: "Failed to update resource." });
      }
    } else if (Action === "DELETE") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: "Resource deleted successfully." });
      } else {
        res.status(400).json({ message: "Failed to delete resource." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

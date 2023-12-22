const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.BoardNotice = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Category,
      Title,
      Usage_Status,
      _Time,
      _Description,
      Image_Attachment,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Category", mssql.VarChar(50), Category)
      .input("Title", mssql.VarChar(50), Title)
      .input("Usage_Status", mssql.Bit, Usage_Status)
      .input("_Time", mssql.DateTime, _Time)
      .input("_Description", mssql.NVarChar(250), _Description)
      .input("Image_Attachment", mssql.VarChar(250), Image_Attachment)
      .execute("sp_Manage_Banner_Notice");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "POST") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: `Resource created successfully.` });
      } else {
        res.status(500).json({ message: `Failed to create resource.` });
      }
    } else if (Action === "PUT") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: `Resource updated successfully.` });
      } else {
        res.status(500).json({ message: `Failed to update resource.` });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

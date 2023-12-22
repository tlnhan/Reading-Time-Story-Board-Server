const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");

exports.MenuPermissionManagement = async (req, res) => {
  try {
    const { Action, Id, Role, Slug, Apply } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Role", mssql.VarChar(20), Role)
      .input("Slug", mssql.VarChar(20), Slug)
      .input("Apply", mssql.Bit, Apply)
      .execute("sp_Menu_Permission_Management");

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
        res.status(500).json({ message: "Failed to deleted resource." });
      }
    } else if (Action === "ROLE") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: "Resource deleted successfully." });
      } else {
        res.status(500).json({ message: "Failed to deleted resource." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

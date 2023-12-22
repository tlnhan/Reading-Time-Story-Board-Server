const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");

exports.Banner = async (req, res) => {
  try {
    const {
      Action,
      Id,
      _Date,
      Banner_Type,
      _Status,
      Banner_Name,
      Making_Slices,
      Creating_Band_Banners_PopUps,
      Title,
      Insert_Image,
      Link_Path,
      _Period,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("_Date", mssql.DateTime, _Date)
      .input("Banner_Type", mssql.VarChar(50), Banner_Type)
      .input("_Status", mssql.VarChar(50), _Status)
      .input("Banner_Name", mssql.VarChar(50), Banner_Name)
      .input("Making_Slices", mssql.Bit, Making_Slices)
      .input(
        "Creating_Band_Banners_PopUps",
        mssql.Bit,
        Creating_Band_Banners_PopUps
      )
      .input("Title", mssql.VarChar(50), Title)
      .input("Insert_Image", mssql.VarChar(50), Insert_Image)
      .input("Link_Path", mssql.VarChar(50), Link_Path)
      .input("_Period", mssql.VarChar(50), _Period)
      .execute("sp_Manage_Banner");

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

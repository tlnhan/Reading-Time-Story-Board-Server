const mssql = require("mssql");
const connectDatabase = require("../../../../../database/mssql");

exports.AdminSettings = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Name,
      Zoom_Api_Key,
      Zoom_Api_Secret,
      Publishable_Key,
      Secret_Key,
      WebHook_Url,
      Account,
      Client_Id,
      Secret,
      Max_Point_On_Month,
      Main_Menu_PC,
      Main_Menu_Mobile,
      Main_Page_Product,
      Free_Trial_Product,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Name", mssql.VarChar(50), Name)
      .input("Zoom_Api_Key", mssql.VarChar(50), Zoom_Api_Key)
      .input("Zoom_Api_Secret", mssql.VarChar(50), Zoom_Api_Secret)
      .input("Publishable_Key", mssql.VarChar(50), Publishable_Key)
      .input("Secret_Key", mssql.VarChar(50), Secret_Key)
      .input("WebHook_Url", mssql.VarChar(50), WebHook_Url)
      .input("Account", mssql.VarChar(50), Account)
      .input("Client_Id", mssql.VarChar(50), Client_Id)
      .input("Secret", mssql.VarChar(50), Secret)
      .input("Max_Point_On_Month", mssql.Int, Max_Point_On_Month)
      .input("Main_Menu_PC", mssql.VarChar(50), Main_Menu_PC)
      .input("Main_Menu_Mobile", mssql.VarChar(50), Main_Menu_Mobile)
      .input("Main_Page_Product", mssql.VarChar(50), Main_Page_Product)
      .input("Free_Trial_Product", mssql.VarChar(50), Free_Trial_Product)
      .execute("sp_Admin_Settings");

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

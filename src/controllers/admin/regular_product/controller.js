const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.RegularProduct = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Product_Name,
      _Description,
      Curriculum,
      Country_Sale,
      Currency,
      Class_Day,
      Price,
      Discount,
      Study_Time,
      ABout_Product,
      Product_Division,
      Class_Days_Total,
      Class_Days_Week,
      Whether_To_Use,
      Expiration_Date,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Product_Name", mssql.VarChar(50), Product_Name)
      .input("_Description", mssql.VarChar(50), _Description)
      .input("Curriculum", mssql.VarChar(50), Curriculum)
      .input("Country_Sale", mssql.VarChar(50), Country_Sale)
      .input("Currency", mssql.VarChar(50), Currency)
      .input("Class_Day", mssql.VarChar(50), Class_Day)
      .input("Price", mssql.Int, Price)
      .input("Discount", mssql.VarChar(50), Discount)
      .input("Study_Time", mssql.VarChar(50), Study_Time)
      .input("ABout_Product", mssql.NVarChar(250), ABout_Product)
      .input("Product_Division", mssql.VarChar(50), Product_Division)
      .input("Class_Days_Total", mssql.Int, Class_Days_Total)
      .input("Class_Days_Week", mssql.Int, Class_Days_Week)
      .input("Whether_To_Use", mssql.Bit, Whether_To_Use)
      .input("Expiration_Date", mssql.DateTime, Expiration_Date)
      .execute("sp_Regular_Product");

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

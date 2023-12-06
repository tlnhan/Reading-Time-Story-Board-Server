const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.PaymentManagement = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Bill,
      Product_Division,
      Country,
      Price,
      Payment_Method,
      Payer,
      Student_Name,
      PG_ID,
      Billing_Key,
      Payment_Date,
      _Status,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Bill", mssql.VarChar(50), Bill)
      .input("Product_Division", mssql.VarChar(50), Product_Division)
      .input("Country", mssql.VarChar(50), Country)
      .input("Price", mssql.Int, Price)
      .input("Payment_Method", mssql.VarChar(50), Payment_Method)
      .input("Payer", mssql.VarChar(50), Payer)
      .input("Student_Name", mssql.VarChar(50), Student_Name)
      .input("PG_ID", mssql.VarChar(50), PG_ID)
      .input("Billing_Key", mssql.VarChar(50), Billing_Key)
      .input("Payment_Date", mssql.DateTime, Payment_Date)
      .input("_Status", mssql.Bit, _Status)
      .execute("sp_Payment_Management");

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

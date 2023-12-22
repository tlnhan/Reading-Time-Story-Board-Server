const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");
const connectCloud = require("../../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
require("dotenv").config();

exports.Coupon = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Coupon_Name,
      _Operation_Mode,
      _Start_Date,
      _Status,
      Discount_Rate,
      Expiration_Date,
      _Type,
      _Target,
      _Cycle,
      _Name,
      _Description,
      Expiration_Period,
      Issue_Date,
      Issued,
      Used,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Coupon_Name", mssql.VarChar(20), Coupon_Name)
      .input("_Operation_Mode", mssql.VarChar(20), _Operation_Mode)
      .input("_Start_Date", mssql.DateTime, _Start_Date)
      .input("_Status", mssql.Bit, _Status)
      .input("Discount_Rate", mssql.VarChar(50), Discount_Rate)
      .input("Expiration_Date", mssql.DateTime, Expiration_Date)
      .input("_Type", mssql.VarChar(50), _Type)
      .input("_Target", mssql.VarChar(50), _Target)
      .input("_Cycle", mssql.VarChar(50), _Cycle)
      .input("_Name", mssql.VarChar(50), _Name)
      .input("_Description", mssql.NVarChar(250), _Description)
      .input("Expiration_Period", mssql.VarChar(50), Expiration_Period)
      .input("Issue_Date", mssql.Int, Issue_Date)
      .input("Issued", mssql.Int, Issued)
      .input("Used", mssql.Int, Used)
      .execute("sp_Manage_Coupon");

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
    } else if (Action === "SEARCH") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ message: "Not found materials." });
      }
    } else if (Action === "EXPORT") {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Coupon");

      const data = result.recordset;

      const header = Object.keys(data[0]);
      worksheet.addRow(header);

      data.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });

      worksheet.columns.forEach((column) => {
        let maxStringLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxStringLength) {
            maxStringLength = columnLength;
          }
        });
        column.width = maxStringLength < 10 ? 10 : maxStringLength;

        column.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      worksheet.views = [
        {
          state: "frozen",
          ySplit: 1,
        },
      ];

      const currentDate = new Date().toISOString().replace(/:/g, "-");
      const excelFileName = `Coupon_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_COUPON_EXCEL,
          resource_type: "auto",
          public_id: excelFileName,
        },
        (error, result) => {
          if (error) {
            console.error(error);
            res
              .status(500)
              .json({ message: "Failed to upload to Cloudinary." });
          } else {
            res.status(200).json({ cloudinaryUrl: result.secure_url });
          }
        }
      );

      const bufferStream = new Readable();
      bufferStream.push(excelBuffer);
      bufferStream.push(null);

      bufferStream.pipe(uploadStream);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

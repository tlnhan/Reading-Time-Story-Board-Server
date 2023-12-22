const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");
const connectCloud = require("../../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
require("dotenv").config();

exports.FreeTrialProduct = async (req, res) => {
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
      Images_Url: imageBuffer,
    } = req.body;

    const uploadResponse = await connectCloud.uploader.upload(imageBuffer, {
      folder: process.env.CLOUD_FREE_TRIAL_PRODUCT_IMG,
      resource_type: "auto",
    });

    const cloudinaryUrl = uploadResponse.secure_url;

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
      .input("Images_Url", mssql.VarChar(mssql.MAX), cloudinaryUrl)
      .execute("sp_Free_Trial_Product");

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
      const worksheet = workbook.addWorksheet("Free_Trial_Product");

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
      const excelFileName = `Free_Trial_Product_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_FREE_TRIAL_PRODUCT_EXCEL,
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

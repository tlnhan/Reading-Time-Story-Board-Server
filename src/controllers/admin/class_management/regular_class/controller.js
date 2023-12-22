const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");
const connectCloud = require("../../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
require("dotenv").config();

exports.RegularClass = async (req, res) => {
  try {
    const {
      Action,
      Team,
      Teacher,
      Student_Name,
      Start_Date,
      End_Date,
      Class_Status,
      Complaint,
      Date,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool.request()
    .input("Action", mssql.VarChar(10), Action)
    .input("Team", mssql.VarChar(50), Team)
    .input("Teacher", mssql.VarChar(50), Teacher)
    .input("Student_Name", mssql.VarChar(50), Student_Name)
    .input("Start_Date", mssql.Date, Start_Date)
    .input("End_Date", mssql.Date, End_Date)
    .input("Class_Status", mssql.VarChar(50), Class_Status)
    .input("Complaint", mssql.VarChar(50), Complaint)
    .input("Date", mssql.Date, Date)
    .execute("sp_Regular_Class");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "SEARCH") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ message: "Not found materials." });
      }
    } else if (Action === "EXPORT") {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Regular_Class");

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
      const excelFileName = `Regular_Class_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_REGULAR_CLASS_EXCEL,
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

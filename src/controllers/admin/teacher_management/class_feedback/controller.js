const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");
const connectCloud = require("../../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
require("dotenv").config();

exports.ClassFeedback = async (req, res) => {
  try {
    const {
      Action,
      Start_Date,
      End_Date,
      Paper_No,
      Team,
      Teacher,
      Student,
      Date,
      Video,
      Tl_Feedback,
      Score,
      Teacher_Comment,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(10), Action)
      .input("Start_Date", mssql.Date, Start_Date)
      .input("End_Date", mssql.Date, End_Date)
      .input("Paper_No", mssql.VarChar(50), Paper_No)
      .input("Team", mssql.VarChar(50), Team)
      .input("Teacher", mssql.VarChar(50), Teacher)
      .input("Student", mssql.VarChar(50), Student)
      .input("Date", mssql.Date, Date)
      .input("Video", mssql.VarChar(mssql.MAX), Video)
      .input("Tl_Feedback", mssql.NVarChar(50), Tl_Feedback)
      .input("Score", mssql.Int, Score)
      .input("Teacher_Comment", mssql.NVarChar(mssql.MAX), Teacher_Comment)
      .execute("sp_Class_Feedback");

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
    } else if (Action === "DETAIL") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "EXPORT") {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Class_Feedback");

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
      const excelFileName = `Class_Feedback_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_CLASS_FEEDBACK_EXCEL,
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
    } else if (Action === "SEARCH") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ message: "Not found materials." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");
const connectCloud = require("../../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
require("dotenv").config();

exports.VacationAndResignationManagement = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Part,
      Name,
      Team_Leader,
      Tl_Confirm,
      Director_Name,
      Director_Confirm,
      Title,
      Day,
      Start_Date,
      End_Date,
      Reasons,
      Attach_Item,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Part", mssql.VarChar(50), Part)
      .input("Name", mssql.VarChar(50), Name)
      .input("Team_Leader", mssql.VarChar(50), Team_Leader)
      .input("Tl_Confirm", mssql.Bit, Tl_Confirm)
      .input("Director_Name", mssql.VarChar(50), Director_Name)
      .input("Director_Confirm", mssql.Bit, Director_Confirm)
      .input("Title", mssql.VarChar(50), Title)
      .input("Day", mssql.Int, Day)
      .input("Start_Date", mssql.DateTime, Start_Date)
      .input("End_Date", mssql.DateTime, End_Date)
      .input("Reasons", mssql.VarChar(mssql.MAX), Reasons)
      .input("Attach_Item", mssql.VarChar(mssql.MAX), Attach_Item)
      .execute("sp_Vacation_And_Resignation_Management");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "POST") {
      const {
        Attach_Item: Attach_Item_File
      } = req.files;

      const uploadToCloudinary = async (file, folderName) => {
        return new Promise((resolve, reject) => {
          const uploadStream = connectCloud.uploader.upload_stream(
            {
              folder: folderName,
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                console.error(error);
                reject("Failed to upload to Cloudinary.");
              } else {
                resolve(result.secure_url);
              }
            }
          );

          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null);

          bufferStream.pipe(uploadStream);
        });
      };

      const attachItemUrl = await uploadToCloudinary(
        Attach_Item_File[0],
        process.env.CLOUD_ATTACH_ITEM_FOLDER
      );

      const resultPost = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Part", mssql.VarChar(50), Part)
      .input("Name", mssql.VarChar(50), Name)
      .input("Team_Leader", mssql.VarChar(50), Team_Leader)
      .input("Tl_Confirm", mssql.Bit, Tl_Confirm)
      .input("Director_Name", mssql.VarChar(50), Director_Name)
      .input("Director_Confirm", mssql.Bit, Director_Confirm)
      .input("Title", mssql.VarChar(50), Title)
      .input("Day", mssql.Int, Day)
      .input("Start_Date", mssql.DateTime, Start_Date)
      .input("End_Date", mssql.DateTime, End_Date)
      .input("Reasons", mssql.VarChar(250), Reasons)
      .input("Attach_Item", mssql.VarChar(50), attachItemUrl)
      .execute("sp_Vacation_And_Resignation_Management");

      if (resultPost.returnValue === 0) {
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
      const worksheet = workbook.addWorksheet(
        "Vacation_And_Resignation_Management"
      );

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
      const excelFileName = `Vacation_And_Resignation_Management_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_VACATION_AND_RESIGNATION_MANAGEMENT_EXCEL,
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

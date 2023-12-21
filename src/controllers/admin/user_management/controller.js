const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");
const connectCloud = require("../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
require("dotenv").config();


exports.AccountUser = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Status,
      Country,
      Member,
      Email,
      Password,
      User_Name,
      User_English_Name,
      Gender,
      Birth,
      Phone,
      Registration_Date,
      Recent_Login,
      Description,
      Image,
      Admission,
      Tags,
      Referral_Code,
      Signup_path,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Status", mssql.VarChar(50), Status)
      .input("Country", mssql.VarChar(50), Country)
      .input("Member", mssql.VarChar(50), Member)
      .input("Email", mssql.VarChar(50), Email)
      .input("Password", mssql.VarChar(50), Password)
      .input("User_Name", mssql.VarChar(50), User_Name)
      .input("User_English_Name", mssql.VarChar(50), User_English_Name)
      .input("Gender", mssql.Bit, Gender)
      .input("Birth", mssql.DateTime, Birth)
      .input("Phone", mssql.VarChar(20), Phone)
      .input("Registration_Date", mssql.DateTime, Registration_Date)
      .input("Recent_Login", mssql.DateTime, Recent_Login)
      .input("Description", mssql.NVarChar(250), Description)
      .input("Image", mssql.VarChar(50), Image)
      .input("Admission", mssql.VarChar(50), Admission)
      .input("Tags", mssql.VarChar(50), Tags)
      .input("Referral_Code", mssql.VarChar(50), Referral_Code)
      .input("Signup_path", mssql.VarChar(50), Signup_path)
      .execute("sp_Account_User");

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
    } else if (Action === "SEARCH") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ message: "Not found materials." });
      }
    } else if (Action === "EXPORT") {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("User_Account");

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
      const excelFileName = `User_Account_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_ACCOUNT_USER_EXCEL,
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

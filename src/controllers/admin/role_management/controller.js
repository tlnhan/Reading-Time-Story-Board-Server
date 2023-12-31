const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");
const connectCloud = require("../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
require("dotenv").config();

exports.RoleManagement = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Approval,
      _Role,
      Country,
      _Name,
      Email,
      Password,
      Phone,
      Registration_Date,
      Recent_Login,
      Gender,
      Nickname,
      Birth,
      Contract_Type,
      _Contract,
      _Start_Date,
      Authority_Type,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Approval", mssql.VarChar(50), Approval)
      .input("_Role", mssql.VarChar(50), _Role)
      .input("Country", mssql.VarChar(50), Country)
      .input("_Name", mssql.VarChar(20), _Name)
      .input("Email", mssql.VarChar(50), Email)
      .input("Password", mssql.VarChar(50), Password)
      .input("Phone", mssql.Int, Phone)
      .input("Registration_Date", mssql.DateTime, Registration_Date)
      .input("Recent_Login", mssql.DateTime, Recent_Login)
      .input("Gender", mssql.Bit, Gender)
      .input("Nickname", mssql.VarChar(50), Nickname)
      .input("Birth", mssql.DateTime, Birth)
      .input("Contract_Type", mssql.VarChar(50), Contract_Type)
      .input("_Contract", mssql.VarChar(50), _Contract)
      .input("_Start_Date", mssql.DateTime, _Start_Date)
      .input("Authority_Type", mssql.VarChar(50), Authority_Type)
      .execute("sp_Role_Management");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "DETAIL") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "POST") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: "Resource created successfully." });
      } else {
        res.status(500).json({ message: "Failed to create resource." });
      }
    } else if (Action === "SEARCH") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ message: "Not found materials." });
      }
    } else if (Action === "EXPORT") {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Role_Management");

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
      const excelFileName = `Role_Management_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_ROLE_MANAGEMENT_EXCEL,
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
    } else if (Action === "TEACHER") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

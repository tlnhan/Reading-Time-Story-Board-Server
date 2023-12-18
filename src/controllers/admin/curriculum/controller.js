const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");
const connectCloud = require("../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
require("dotenv").config();

exports.CurriculumContents = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Unique_No,
      Curriculum_Title,
      Subtitle,
      Description,
      Division,
      Whether_To_Use,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Unique_No", mssql.VarChar(50), Unique_No)
      .input("Curriculum_Title", mssql.VarChar(50), Curriculum_Title)
      .input("Subtitle", mssql.VarChar(50), Subtitle)
      .input("Description", mssql.VarChar(mssql.MAX), Description)
      .input("Division", mssql.VarChar(50), Division)
      .input("Whether_To_Use", mssql.Bit, Whether_To_Use)
      .execute("sp_Curriculum_Contents");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "POST") {
      if (req.file) {
        upload.single("file")(req, res, async (err) => {
          if (err) {
            return res.status(400).json({ message: "Error uploading file." });
          } else {
            try {
              const workbook = new exceljs.Workbook();
              await workbook.xlsx.load(req.file.buffer);

              const worksheet = workbook.worksheets[0];

              for (let i = 2; i <= worksheet.rowCount; i++) {
                const rowValues = worksheet.getRow(i).values;

                const [
                  Unique_No,
                  Curriculum_Title,
                  Subtitle,
                  Description,
                  Division,
                  Whether_To_Use,
                ] = rowValues;

                const result = await pool
                  .request()
                  .input("Action", mssql.VarChar(20), "POST")
                  .input("Unique_No", mssql.VarChar(50), Unique_No)
                  .input(
                    "Curriculum_Title",
                    mssql.VarChar(50),
                    Curriculum_Title
                  )
                  .input("Subtitle", mssql.VarChar(50), Subtitle)
                  .input("Description", mssql.VarChar(mssql.MAX), Description)
                  .input("Division", mssql.VarChar(50), Division)
                  .input("Whether_To_Use", mssql.Bit, Whether_To_Use)
                  .execute("sp_Curriculum_Contents");

                if (result.returnValue !== 0) {
                  return res
                    .status(500)
                    .json({ message: `Failed to create resource.` });
                }
              }

              res
                .status(200)
                .json({ message: `Resources created successfully.` });
            } catch (error) {
              console.error(error);
              res
                .status(500)
                .json({ message: "Failed to process Excel file." });
            }
          }
        });
      }
      if (result.returnValue === 0) {
        res.status(200).json({ message: `Resource created successfully.` });
      } else {
        res.status(500).json({ message: `Failed to create resource.` });
      }
    } else if (Action === "SEARCH") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ message: "Not found materials." });
      }
    } else if (Action === "EXPORT") {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Curriculum_Contents");

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
      const excelFileName = `Curriculum_Contents_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_CURRICULUM_CONTENTS_EXCEL,
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

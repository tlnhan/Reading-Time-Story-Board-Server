const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");
const connectCloud = require("../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fileType = require("file-type");
require("dotenv").config();

const isValidFileType = (fileBuffer) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const type = fileType(fileBuffer);
  return type && allowedTypes.includes(type.mime);
};

exports.BookContent = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Book_Title,
      Subtitle,
      Genre,
      Grade,
      Lexile,
      _Page,
      Vocabulary,
      Registration_Date,
      Whether_To_Use,
      Summary_Synopsis,
      Class_Goal,
      Level,
      Cover_Image,
      Attachments,
      Brief_Description,
      Page,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Book_Title", mssql.VarChar(50), Book_Title)
      .input("Subtitle", mssql.VarChar(50), Subtitle)
      .input("Genre", mssql.VarChar(50), Genre)
      .input("Grade", mssql.VarChar(50), Grade)
      .input("Lexile", mssql.VarChar(50), Lexile)
      .input("_Page", mssql.VarChar(50), _Page)
      .input("Vocabulary", mssql.VarChar(50), Vocabulary)
      .input("Registration_Date", mssql.DateTime, Registration_Date)
      .input("Whether_To_Use", mssql.VarChar(50), Whether_To_Use)
      .input("Summary_Synopsis", mssql.VarChar(50), Summary_Synopsis)
      .input("Class_Goal", mssql.VarChar(50), Class_Goal)
      .input("Level", mssql.VarChar(50), Level)
      .input("Cover_Image", mssql.VarChar(50), Cover_Image)
      .input("Attachments", mssql.VarChar(50), Attachments)
      .input("Brief_Description", mssql.VarChar(50), Brief_Description)
      .input("Page", mssql.VarChar(50), Page)
      .execute("sp_Book_Contents");

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
            let coverImageResult;
            let attachmentsResult;

            if (Attachments && req.file && !isValidFileType(req.file.buffer)) {
              return res.status(400).json({
                message:
                  "Invalid file type for Attachments. Allowed types: PDF, images, documents.",
              });
            }
            const currentDate = new Date().toISOString().replace(/:/g, "-");
            const coverImageName = `Cover_Image_${currentDate}`;

            coverImageResult = await connectCloud.uploader.upload(
              req.body.Cover_Image,
              {
                folder: process.env.CLOUD_COVER_IMAGE,
                resource_type: "auto",
                public_id: coverImageName,
              }
            );

            const attachmentsName = `Attachments_${currentDate}`;

            attachmentsResult = await connectCloud.uploader.upload(
              req.body.Attachments,
              {
                folder: process.env.CLOUD_ATTACHMENTS,
                resource_type: "auto",
                public_id: attachmentsName,
              }
            );
            const workbook = new exceljs.Workbook();
            await workbook.xlsx.load(req.file.buffer);

            const worksheet = workbook.worksheets[0];

            for (let i = 2; i <= worksheet.rowCount; i++) {
              const rowValues = worksheet.getRow(i).values;

              const [
                Book_Title,
                Subtitle,
                Genre,
                Grade,
                Lexile,
                _Page,
                Vocabulary,
                Registration_Date,
                Whether_To_Use,
                Summary_Synopsis,
                Class_Goal,
                Level,
                coverImageResult,
                attachmentsResult,
                Brief_Description,
                Page,
              ] = rowValues;

              const result = await pool
                .request()
                .input("Action", mssql.VarChar(20), "POST")
                .input("Book_Title", mssql.VarChar(50), Book_Title)
                .input("Subtitle", mssql.VarChar(50), Subtitle)
                .input("Genre", mssql.VarChar(50), Genre)
                .input("Grade", mssql.VarChar(50), Grade)
                .input("Lexile", mssql.VarChar(50), Lexile)
                .input("_Page", mssql.VarChar(50), _Page)
                .input("Vocabulary", mssql.VarChar(50), Vocabulary)
                .input("Registration_Date", mssql.DateTime, Registration_Date)
                .input("Whether_To_Use", mssql.VarChar(50), Whether_To_Use)
                .input("Summary_Synopsis", mssql.VarChar(50), Summary_Synopsis)
                .input("Class_Goal", mssql.VarChar(50), Class_Goal)
                .input("Level", mssql.VarChar(50), Level)
                .input("Cover_Image", mssql.VarChar(50), coverImageResult)
                .input("Attachments", mssql.VarChar(50), attachmentsResult)
                .input(
                  "Brief_Description",
                  mssql.VarChar(50),
                  Brief_Description
                )
                .input("Page", mssql.VarChar(50), Page)
                .execute("sp_Book_Contents");

              if (result.returnValue !== 0) {
                return res
                  .status(500)
                  .json({ message: `Failed to create resource.` });
              }
            }
          }
        });
      }
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
      const worksheet = workbook.addWorksheet("Book_Contents");

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
      const excelFileName = `Book_Contents_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_BOOK_CONTENTS_EXCEL,
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

const mssql = require("mssql");
const connectDatabase = require("../../../../database/mssql");
const connectCloud = require("../../../../database/cloudinary");
const exceljs = require("exceljs");
const { Readable } = require("stream");
require("dotenv").config();

exports.AccountTeacher = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Teacher_Name,
      Nick_Name,
      Email,
      Password,
      Gender,
      Birth,
      Country,
      Timezone,
      Contract_Type,
      Contract,
      Start_Date,
      Resignation_Day,
      Career,
      Using_The_Editor,
      Certificate,
      Resume,
      Status,
      Level,
      Special_Feature,
      Self_Introduction,
      Recommended_Student,
      Recommended_Level,
      Character,
      Lesson_Style,
      Video,
      Student_Review,
      Comment,
      Image,
      Team,
      Phone,
      Tag,
      Recent_Login,
      Point,
      Penalty,
      PointMin,
      PointMax,
      PenaltyMin,
      PenaltyMax,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Teacher_Name", mssql.VarChar(50), Teacher_Name)
      .input("Nick_Name", mssql.VarChar(50), Nick_Name)
      .input("Email", mssql.VarChar(50), Email)
      .input("Password", mssql.VarChar(50), Password)
      .input("Gender", mssql.Bit, Gender)
      .input("Birth", mssql.DateTime, Birth)
      .input("Country", mssql.VarChar(50), Country)
      .input("Timezone", mssql.VarChar(50), Timezone)
      .input("Contract_Type", mssql.VarChar(50), Contract_Type)
      .input("Contract", mssql.VarChar(50), Contract)
      .input("Start_Date", mssql.DateTime, Start_Date)
      .input("Resignation_Day", mssql.DateTime, Resignation_Day)
      .input("Career", mssql.VarChar(50), Career)
      .input("Using_The_Editor", mssql.VarChar(50), Using_The_Editor)
      .input("Certificate", mssql.VarChar(mssql.MAX), Certificate)
      .input("Resume", mssql.VarChar(mssql.MAX), Resume)
      .input("Status", mssql.VarChar(50), Status)
      .input("Level", mssql.VarChar(50), Level)
      .input("Special_Feature", mssql.VarChar(50), Special_Feature)
      .input("Self_Introduction", mssql.VarChar(mssql.MAX), Self_Introduction)
      .input("Recommended_Student", mssql.VarChar(50), Recommended_Student)
      .input("Recommended_Level", mssql.VarChar(50), Recommended_Level)
      .input("Character", mssql.VarChar(50), Character)
      .input("Lesson_Style", mssql.VarChar(50), Lesson_Style)
      .input("Video", mssql.VarChar(50), Video)
      .input("Student_Review", mssql.VarChar(50), Student_Review)
      .input("Comment", mssql.VarChar(50), Comment)
      .input("Image", mssql.VarChar(50), Image)
      .input("Team", mssql.VarChar(50), Team)
      .input("Phone", mssql.VarChar(50), Phone)
      .input("Tag", mssql.VarChar(50), Tag)
      .input("Recent_Login", mssql.VarChar(50), Recent_Login)
      .input("Point", mssql.Int, Point)
      .input("Penalty", mssql.Int, Penalty)
      .input("PointMin", mssql.Int, PointMin)
      .input("PointMax", mssql.Int, PointMax)
      .input("PenaltyMin", mssql.Int, PenaltyMin)
      .input("PenaltyMax", mssql.Int, PenaltyMax)
      .execute("sp_Account_Teacher");

    if (Action === "GET") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(404).json({ message: "Not found materials." });
      }
    } else if (Action === "POST") {
      const {
        Contract: ContractFile,
        Certificate: CertificateFiles,
        Resume: ResumeFile,
        Video: VideoFile,
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

      const contractUrl = await uploadToCloudinary(
        ContractFile[0],
        process.env.CLOUD_CONTRACT_FOLDER
      );
      const certificateUrls = await Promise.all(
        CertificateFiles.map((certificateFile) =>
          uploadToCloudinary(
            certificateFile,
            process.env.CLOUD_CERTIFICATE_FOLDER
          )
        )
      );
      const resumeUrl = await uploadToCloudinary(
        ResumeFile[0],
        process.env.CLOUD_RESUME_FOLDER
      );
      const videoUrl = await uploadToCloudinary(
        VideoFile[0],
        process.env.CLOUD_VIDEO_FOLDER
      );

      const resultPost = await pool
        .request()
        .input("Action", mssql.VarChar(20), Action)
        .input("Id", mssql.Int, Id)
        .input("Teacher_Name", mssql.VarChar(50), Teacher_Name)
        .input("Nick_Name", mssql.VarChar(50), Nick_Name)
        .input("Email", mssql.VarChar(50), Email)
        .input("Password", mssql.VarChar(50), Password)
        .input("Gender", mssql.Bit, Gender)
        .input("Birth", mssql.DateTime, Birth)
        .input("Country", mssql.VarChar(50), Country)
        .input("Timezone", mssql.VarChar(50), Timezone)
        .input("Contract_Type", mssql.VarChar(50), Contract_Type)
        .input("Contract", mssql.VarChar(50), contractUrl)
        .input("Start_Date", mssql.DateTime, Start_Date)
        .input("Resignation_Day", mssql.DateTime, Resignation_Day)
        .input("Career", mssql.VarChar(50), Career)
        .input("Using_The_Editor", mssql.VarChar(50), Using_The_Editor)
        .input(
          "Certificate",
          mssql.VarChar(mssql.MAX),
          certificateUrls.join(";")
        )
        .input("Resume", mssql.VarChar(mssql.MAX), resumeUrl)
        .input("Status", mssql.VarChar(50), Status)
        .input("Level", mssql.VarChar(50), Level)
        .input("Special_Feature", mssql.VarChar(50), Special_Feature)
        .input("Self_Introduction", mssql.VarChar(mssql.MAX), Self_Introduction)
        .input("Recommended_Student", mssql.VarChar(50), Recommended_Student)
        .input("Recommended_Level", mssql.VarChar(50), Recommended_Level)
        .input("Character", mssql.VarChar(50), Character)
        .input("Lesson_Style", mssql.VarChar(50), Lesson_Style)
        .input("Video", mssql.VarChar(50), videoUrl)
        .input("Student_Review", mssql.VarChar(50), Student_Review)
        .input("Comment", mssql.VarChar(50), Comment)
        .input("Image", mssql.VarChar(50), Image)
        .input("Team", mssql.VarChar(50), Team)
        .input("Phone", mssql.VarChar(50), Phone)
        .input("Tag", mssql.VarChar(50), Tag)
        .input("Recent_Login", mssql.VarChar(50), Recent_Login)
        .input("Point", mssql.Int, Point)
        .input("Penalty", mssql.Int, Penalty)
        .input("PointMin", mssql.Int, PointMin)
        .input("PointMax", mssql.Int, PointMax)
        .input("PenaltyMin", mssql.Int, PenaltyMin)
        .input("PenaltyMax", mssql.Int, PenaltyMax)
        .execute("sp_Account_Teacher");

      if (resultPost.returnValue === 0) {
        res.status(200).json({ message: "Resource created successfully." });
      } else {
        res.status(500).json({ message: "Failed to create resource." });
      }
    } else if (Action === "PUT") {
      if (result.returnValue === 0) {
        res.status(200).json({ message: "Resource updated successfully." });
      } else {
        res.status(500).json({ message: "Failed to update resource." });
      }
    } else if (Action === "SEARCH") {
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ message: "Not found materials." });
      }
    } else if (Action === "EXPORT") {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Account_Teacher");

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
      const excelFileName = `Account_Teacher_${currentDate}.xlsx`;

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const uploadStream = connectCloud.uploader.upload_stream(
        {
          folder: process.env.CLOUD_ACCOUNT_TEACHER_EXCEL,
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

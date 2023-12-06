const mssql = require("mssql");
const connectDatabase = require("../../../database/mssql");

exports.WorkingHours = async (req, res) => {
  try {
    const {
      Action,
      Id,
      Team,
      Team_Leader,
      Teacher,
      Teacher_NickName,
      Sun,
      Mon,
      Tue,
      Wed,
      Thu,
      Fri,
      Sat,
      Sun_Start,
      Sun_End,
      Mon_Start,
      Mon_End,
      Tue_Start,
      Tue_End,
      Wed_Start,
      Wed_End,
      Thu_Start,
      Thu_End,
      Fri_Start,
      Fri_End,
      Sat_Start,
      Sat_End,
    } = req.body;

    const pool = await mssql.connect(connectDatabase);

    const result = await pool
      .request()
      .input("Action", mssql.VarChar(20), Action)
      .input("Id", mssql.Int, Id)
      .input("Team", mssql.VarChar(50), Team)
      .input("Team_Leader", mssql.VarChar(50), Team_Leader)
      .input("Teacher", mssql.VarChar(50), Teacher)
      .input("Teacher_NickName", mssql.VarChar(50), Teacher_NickName)
      .input("Sun", mssql.Bit, Sun)
      .input("Mon", mssql.Bit, Mon)
      .input("Tue", mssql.Bit, Tue)
      .input("Wed", mssql.Bit, Wed)
      .input("Thu", mssql.Bit, Thu)
      .input("Fri", mssql.Bit, Fri)
      .input("Sat", mssql.Bit, Sat)
      .input("Sun_Start", mssql.Time, Sun_Start)
      .input("Sun_End", mssql.Time, Sun_End)
      .input("Mon_Start", mssql.Time, Mon_Start)
      .input("Mon_End", mssql.Time, Mon_End)
      .input("Tue_Start", mssql.Time, Tue_Start)
      .input("Tue_End", mssql.Time, Tue_End)
      .input("Wed_Start", mssql.Time, Wed_Start)
      .input("Wed_End", mssql.Time, Wed_End)
      .input("Thu_Start", mssql.Time, Thu_Start)
      .input("Thu_End", mssql.Time, Thu_End)
      .input("Fri_Start", mssql.Time, Fri_Start)
      .input("Fri_End", mssql.Time, Fri_End)
      .input("Sat_Start", mssql.Time, Sat_Start)
      .input("Sat_End", mssql.Time, Sat_End)
      .execute("sp_Working_Hours");

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
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

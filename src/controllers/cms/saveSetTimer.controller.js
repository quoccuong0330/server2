const { insertTimer } = require("../../models/connectDB");

async function action(req, res) {
  const role_current_user = "root";

  const data = { ...req.body };

  const resDB = await insertTimer(data);
  if (resDB) {
    res.send("Add timer successfully");
  } else {
    res.send("Add timer failure");
  }
}

exports.action = action;

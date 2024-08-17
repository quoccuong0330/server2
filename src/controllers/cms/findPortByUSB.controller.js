const sidebarControl = require("../../services/cms/sidebarControl");
const { getAllPort, getAllDevice } = require("../../models/connectDB");
async function action(req, res) {
  const role_current_user = "root";

  const data = [
    {
      id: "123",
      isUse: true,
    },
    {
      id: "456",
      isUse: false,
    },
  ];

  res.send(data);
}

exports.action = action;

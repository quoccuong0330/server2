const sidebarControl = require("../../services/cms/sidebarControl");
const { getAllPort, getAllDevice } = require("../../models/connectDB");
async function action(req, res) {
  const role_current_user = "root";
  const data = [
    {
      id: "123",
      maxPort: 8,
      idPort: "qweqw123123",
    },
    {
      id: "456",
      maxPort: 6,
      idPort: "123qwe2311e",
    },
  ];

  for (const item of data) {
    if (item.id == req.query.idPort) {
      res.send(item);
    }
  }
}

exports.action = action;

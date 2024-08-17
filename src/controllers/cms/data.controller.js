const sidebarControl = require("../../services/cms/sidebarControl");
const { filterHistory, getAllDevice } = require("../../models/connectDB");

async function action(req, res) {
  const role_current_user = "root";
  let sidebar_data = await sidebarControl("a5", role_current_user);

  let data = {
    port: "qweqw123123",
    timestamp: {
      $gte: new Date("2024-05-01T12:34:24.057+00:00"),
      $lte: new Date("2024-05-03T14:21:28.378+00:00"),
    },
  };

  let result = await filterHistory(data);

  const arrayDevice = await getAllDevice();

  res.render(sidebar_data.active_page.page_name, {
    ...sidebar_data,
    arrayDevice,
    layout: "./layouts/cms-layout.ejs",
  });
}

exports.action = action;

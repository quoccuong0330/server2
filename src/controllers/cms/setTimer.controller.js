const {
  getAllPortIsActive,
  getAllPort,
  getAllDevice,
} = require("../../models/connectDB");
const sidebarControl = require("../../services/cms/sidebarControl");

async function action(req, res) {
  const role_current_user = "root";
  let sidebar_data = await sidebarControl("a71", role_current_user);

  let deviceArray = await getAllDevice();
  deviceArray = deviceArray.filter((i) => i.type === "light");
  let portArray = await getAllPort();

  //   const idDeviceArray = [...new Set(portisActive.map((item) => item.idPort))];
  res.render(sidebar_data.active_page.page_name, {
    deviceArray,
    portArray,
    ...sidebar_data,
    layout: "./layouts/cms-layout.ejs",
  });
}

exports.action = action;

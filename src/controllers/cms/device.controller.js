const sidebarControl = require("../../services/cms/sidebarControl");
const {
  getAllPort,
  getAllDevice,
  findDevice,
} = require("../../models/connectDB");

async function action(req, res) {
  const role_current_user = "root";

  const data = await getAllPort();
  const dataDevice = await getAllDevice();
  let arrayDevice = [];

  for (const item of dataDevice) {
    const id = item.idDevice;
    const itemDevice = data.filter(
      (i) => i.idPort === id && item.type === "light"
    );
    if (itemDevice.length > 0) {
      arrayDevice.push(itemDevice);
    }
  }

  for (const item of arrayDevice) {
    item.sort((a, b) => a.order - b.order);
  }

  let sidebar_data = await sidebarControl("a2", role_current_user);
  res.render(sidebar_data.active_page.page_name, {
    ...sidebar_data,
    arrayDevice,
    layout: "./layouts/cms-layout.ejs",
  });
}

exports.action = action;

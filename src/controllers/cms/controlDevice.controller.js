const sidebarControl = require("../../services/cms/sidebarControl");
const {
  getAllPort,
  getAllDevice,
  getAllPortIsActive,
} = require("../../models/connectDB");
async function action(req, res) {
  const role_current_user = "root";

  const data = await getAllPort();
  const dataDevice = await getAllDevice();
  let arrayDevice = [];

  for (const item of dataDevice) {
    const id = item.idDevice;
    const itemDevice = data.filter(
      (i) => i.idPort === id && i.isActive == "true"
    );

    if (itemDevice.length > 0) {
      arrayDevice.push(itemDevice);
    }
  }

  for (const item of arrayDevice) {
    item.sort((a, b) => a.order - b.order);
  }

  //call function to get temperature, humidity
  const getTempAndHumidity = () => {
    return { temp: 31, humidity: 12 };
  };

  const resTempAndHumidity = getTempAndHumidity();

  let sidebar_data = await sidebarControl("a1", role_current_user);
  res.render(sidebar_data.active_page.page_name, {
    arrayDevice,
    resTempAndHumidity,
    ...sidebar_data,
    layout: "./layouts/cms-layout.ejs",
  });
}

exports.action = action;

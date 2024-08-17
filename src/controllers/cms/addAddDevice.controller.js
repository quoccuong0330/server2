const sidebarControl = require("../../services/cms/sidebarControl");
const {
  insertDevice,
  insertPortOfDevice,
  findDeviceByID,
} = require("../../models/connectDB");
async function action(req, res) {
  const role_current_user = "root";

  const data = { ...req.body };
  const check = await findDeviceByID(data.idDevice);

  if (check === null) {
    await insertDevice(data);

    let dataPort = [];
    for (let i = 0; i < data.maxPortUSB; i++) {
      dataPort.push({
        portNumber: i,
        name: "",
        order: i,
        idDevice: data.idPort,
        port1: 0,
        port2: 0,
        isActive: "false",
      });
    }
    await insertPortOfDevice(dataPort);
    res.send("Add device successfully");
  } else {
    res.send("Port has exits!!!");
  }
}

exports.action = action;

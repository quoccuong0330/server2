const sidebarControl = require("../../services/cms/sidebarControl");
const {
  getAllPortIsActive,
  updateBrightnessByPortNumber,
} = require("../../models/connectDB");
const { ObjectId } = require("mongodb");
const { sendValue } = require("~/services/socket");

async function action(req, res) {
  const data = await getAllPortIsActive();

  for (const item of data) {
    const dataOff = {
      valuePort1: "0",
      valuePort2: "0",
      valueOrder: item.order,
      idDevice: item.idPort,
    };
    sendValue({
      topic: item.idPort,
      data: `${item.order},0,0`,
    });

    await updateBrightnessByPortNumber({
      ...dataOff,
      isActive: "true",
    });
  }
}

exports.action = action;

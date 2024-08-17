const { sendValue } = require("~/services/socket");
const { writeCommand } = require("../../services/serialPort/serviceSerialPort");

async function action(req, res) {
  const data = { ...req.body };
  writeCommand(data);
  sendValue(data);

  res.send("Success");
}

exports.action = action;

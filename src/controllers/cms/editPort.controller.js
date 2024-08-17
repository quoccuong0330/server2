const { updatePortByPortNumber } = require("../../models/connectDB");

async function action(req, res) {
  const role_current_user = "root";

  const data = { ...req.body };

  const dataDB = convertToArray(data);

  for (const item of dataDB) {
    const res = await updatePortByPortNumber(item);
  }
  res.send("Save port successfully!!!");
}

function convertToArray(data) {
  let result = [];

  let maxIndex = 0;
  for (const key in data) {
    const index = parseInt(key.match(/\[(.*?)\]/)[1]);
    if (index > maxIndex) {
      maxIndex = index;
    }
  }

  for (let i = 0; i <= maxIndex; i++) {
    if (data[`data[${i}][idPort]`]) {
      result.push({
        name: data[`data[${i}][name]`],
        order: data[`data[${i}][order]`],
        idPort: data[`data[${i}][idPort]`],
        isActive: data[`data[${i}][isActive]`],
        colorPort1: data[`data[${i}][colorPort1]`],
        colorPort2: data[`data[${i}][colorPort2]`],
      });
    }
  }

  return result;
}

exports.action = action;

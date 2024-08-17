const { insertDevice, insertPortOfDevice } = require("../../models/connectDB");

function convert(inputObject) {
  const outputObject = {
    arrayPort: [],
    idDevice: inputObject.idDevice,
  };

  // Iterate through keys of inputObject
  for (const key in inputObject) {
    if (key.startsWith("arrayPort")) {
      const [, index, property] = key.match(/\[(\d+)\]\[(\w+)\]/);
      const portIndex = parseInt(index);
      const propName = property;
      const propValue = inputObject[key];

      if (!outputObject.arrayPort[portIndex]) {
        outputObject.arrayPort[portIndex] = {
          id: "",
          port1: "",
          port2: "",
          brightness: "",
          portNumber: "",
        };
      }

      outputObject.arrayPort[portIndex][propName] = propValue;
    }
  }

  return outputObject;
}

async function action(req, res) {
  const data = req.body;

  const { arrayPort, idDevice } = data;

  const resInsert = await insertDevice({ id: idDevice });
  const idObjectDevice = resInsert.insertedId.toString();
  for (let item of data.arrayPort) {
    item = { ...item, idDevice: idObjectDevice };
    await insertPortOfDevice(item);
  }

  res.send({
    status: true,
    message: "oke",
  });

  //find by idDevice,portId
  // const record = {
  //   objectId,
  //   idDevice,
  //   portId,
  // timestamp,
  //   data: {
  //     chanel1,
  //     chanel2,
  //     brightness,
  //   },
  //   type,
  //   virtualDevice
  // };

  //virtual port of Device
  // const virtualDevice = {
  //   objectId,
  //   // idDevice,
  //   name,
  //   portId,
  //   timestamp,
  //   type,
  // };
}

exports.action = action;

const mqtt = require("mqtt");
const { sendValueTemp } = require("../socket");
const client = mqtt.connect("mqtt://192.168.1.33", {
  username: "dev",
  password: "123456z",
  port: 1883,
});
client.on("connect", () => {
  client.subscribe("presence", (err) => {
    if (!err) {
      client.publish("presence", "1111");
    }
  });
  //nhiet do
  client.subscribe("temp", (err) => {
    if (!err) {
      //save database
      //socket to client ()

      sendValueTemp({
        id: "device2",
        temperature: getRandomNumber(),
        humidity: getRandomNumber(),
      });
    }
  });
});
const writeCommand = async (command) => {
  // command={topic, data}
  // write,data
  // console.log("command", command);
  client.publish("device1", command.data);
  // client.publish(command.topic, command.data);

  try {
  } catch (error) {}

  return true;
};

exports.writeCommand = writeCommand;

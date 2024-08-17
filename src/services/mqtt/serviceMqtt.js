// const mqtt = require("mqtt");
// export const client = mqtt.connect("mqtt://192.168.1.33", {username:"dev", password:"123456z",port:1883});
// client.on("connect", () => {
//   client.subscribe("presence", (err) => {
//     if (!err) {
//       client.publish("presence", "Hello mqtt");
//     }
//   });
// });

// client.on("message", (topic, message) => {
//   // message is Buffer
//   console.log(message.toString());
//   client.end();
// });
// const client = require('../../app')

// client.on("message", (topic, message) => {
//   // message is Buffer
//   console.log(message.toString());
//   client.end();
// });
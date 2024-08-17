const { CronJob } = require("cron");
const {
  getAllTimerIsActive,
  updatePortByPortNumber,
  updateBrightnessByPortNumber,
} = require("../../models/connectDB");
const { writeCommand } = require("../serialPort/serviceSerialPort");
const { sendValue } = require("../socket");

const worker = async () => {
  const data = new Date().toLocaleTimeString("vi-VI", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
  const timeArray = data.split(":");
  const arrayTimerActive = await getAllTimerIsActive(timeArray[0]);
  let arrayTimerOn = [];
  for (const item of arrayTimerActive) {
    if (
      item.valueMinute == timeArray[1] ||
      item.valueMinute == Number(timeArray[1] - 1)
    ) {
      arrayTimerOn.push(item);
    }
  }
  let i = 0;
  const timeOn = () =>
    setInterval(() => {
      const item = arrayTimerOn[i];
      if (item) {
        writeCommand({
          topic: item.idDevice,
          data: `${item.valueOrder},${item.valuePort1},${item.valuePort2}`,
        });
        sendValue({
          topic: item.idDevice,
          data: `${item.valueOrder},${item.valuePort1},${item.valuePort2}`,
        });

        updateBrightnessByPortNumber({
          ...item,
          isActive: item.status === "active" ? "true" : "false",
        });
      }
      i++;
      if (i > arrayTimerOn.length - 1) {
        clearInterval(timeOn);
      }
    }, 2000);
  if (arrayTimerOn.length > 0) {
    timeOn();
  }
};

const job = new CronJob(
  "*/10 * * * * *", // cronTime
  function () {
    console.log("flag");
    worker();
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles" // timeZone
);

const startJob = () => {
  job.start();
};

function getRandomNumber() {
  return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

// Example usage:

exports.worker = worker;
exports.startJob = startJob;

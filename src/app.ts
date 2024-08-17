import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import { io, sendValueTemp } from "./services/socket";
// const startJob = require('./services/worker/worker.js')

// import { passport } from '~/config';

dotenv.config();

// create a express server
const app: express.Application = express();

// setting logger
app.use(morgan("dev"));

// configure header information
// allow request from any source
// app.use(cors());
// app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup express session
app.use(session({ secret: "secret", saveUninitialized: true, resave: true }));

io;
// setup passport

/* ===== View ===== */
// setting the view engine
app.set("view engine", "ejs");
// setting the root path for views directory
app.set("views", path.join(__dirname, "views"));
// setting the express ejs layout
app.use(expressLayouts);
// app.set('layout', './layouts/website.ejs');
app.set("layout", "layouts/default-layout");
// setting static content
app.use(express.static(path.join(__dirname, "statics")));

/* ===== Router ===== */
const routes = require("./routes/index.js");
routes(app);
app.get("/", function (req, res) {
  res.redirect("/control-device");
});

const mqtt = require("mqtt");
// export const client = mqtt.connect("mqtt://192.168.1.33", {username:"dev", password:"123456z",port:1883});
// client.on("connect", () => {
//   client.subscribe("presence", (err:any) => {
//     if (!err) {
//       client.publish("presence", "Hello mqtt");
//     }
//   });
// });

// client.on("message", (topic:any, message:any) => {
//   // message is Buffer
//   console.log(message.toString());
//   client.end();
// });

// startJob()

function getRandomNumber() {
  return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

// setInterval(() => {
//   sendValueTemp({
//     id: "device2",
//     temperature: getRandomNumber(),
//     humidity: getRandomNumber(),
//   });
// }, 10000);

// error handling
const { errorHandler } = require("~/middlewares/errors.middleware.js");
app.use(errorHandler);

export default app;

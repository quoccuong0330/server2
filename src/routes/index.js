const { cmsRouter } = require("./cms/index.js");
const { startJob } = require("../services/worker/worker.js");

// startJob()
const routes = (app) => {
  app.use("/", cmsRouter);
  
};

module.exports = routes;

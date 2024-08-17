const { filterHistory, getAllDevice } = require("../../models/connectDB");

async function action(req, res) {
  let r = { ...req.body };
  let arrayIdPort = r["arrayIdPort[]"] ? r["arrayIdPort[]"] : [];
  if (typeof arrayIdPort === "string") {
    arrayIdPort = [arrayIdPort];
  }
  if (r.fromDate === "") {
    r.fromDate = "2020-01-01T13:21:28.378+00:00";
  }
  if (r.toDate === "") {
    r.toDate = "2030-01-01T13:21:28.378+00:00";
  }

  let arrayResult = [];
  if (arrayIdPort.length > 0) {
    for (const item of arrayIdPort) {
      let data = {
        port: item,
        timestamp: {
          $gte: new Date(r.fromDate),
          $lte: new Date(r.toDate),
        },
      };

      let result = await filterHistory(data);
      arrayResult.push(result);
    }
  } else {
    let data = {
      port: arrayIdPort,
      timestamp: {
        $gte: new Date(r.fromDate),
        $lte: new Date(r.toDate),
      },
    };

    let result = await filterHistory(data);
    arrayResult.push(result);
  }

  res.send(arrayResult);
}

exports.action = action;

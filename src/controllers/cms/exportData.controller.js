const CsvParser = require("json2csv").Parser;
const { filterHistory, getAllDevice } = require("../../models/connectDB");

async function action(req, res) {
  let r = { ...req.query };
  let arrayIdPort = r["arrayIdPort"] ? r["arrayIdPort"] : [];
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
  if (arrayIdPort) {
    for (const item of arrayIdPort) {
      let data = {
        port: item,
        timestamp: {
          $gte: new Date(r.fromDate),
          $lte: new Date(r.toDate),
        },
      };

      let result = await filterHistory(data);
      result.forEach((data) => {
        arrayResult.push(data);
      });
    }
  }
  //   } else {
  //     let data = {
  //       port: arrayIdPort,
  //       timestamp: {
  //         $gte: new Date(r.fromDate),
  //         $lte: new Date(r.toDate),
  //       },
  //     };

  //     let result = await filterHistory(data);
  //     arrayResult = result;
  //   }

  const dataExport = [];
  arrayResult.forEach((data) => {
    const { _id, port, port1, port2, brightness, timestamp } = data;
    const dateByTimestamp = new Date(timestamp).getTime();
    dataExport.push({
      idDevice: _id,
      port,
      port1,
      port2,
      timestamp: dateByTimestamp,
    });
  });

  const csvFields = [
    "idDevice",
    "idPort",
    "port1",
    "port2",
    "timestamp",
  ];
  const csvParser = new CsvParser({ csvFields });
  const csvData = csvParser.parse(dataExport);


  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment: filename=data.csv");
  res.status(200).end(csvData);
}

exports.action = action;

const { MongoClient, ObjectId } = require("mongodb");

const uri =
  process.env.MONGODB_CONNSTRING || process.env.DEV_MONGODB_CONNSTRING;

const client = new MongoClient(uri);
const dbName = "dashbroad";

async function insertDevice(id) {
  console.log(id);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("device");
    const insertResult = await collection.insertOne(id);
    return {
      errCode: 0,
      insertResult,
    };
  } catch (err) {
    console.log(err);
  }

  client.close();
  return true;
}

async function insertHistoryEdit(data) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("history_edit");
    const insertResult = await collection.insertOne(data);
    return {
      errCode: 0,
      insertResult,
    };
  } catch (err) {
    console.log(err);
  }

  client.close();
  return true;
}

async function insertTimer(data) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("timer");
    const insertResult = await collection.insertOne(data);
    return {
      errCode: 0,
      insertResult,
    };
  } catch (err) {
    console.log(err);
  }

  client.close();
  return true;
}

async function getAllTimer() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("timer");
    const insertResult = collection.find().toArray();
    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

async function getAllTimerIsActive(hour) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("timer");
    const insertResult = collection
      .find({ status: "active", valueHour: { $eq: hour } })
      .toArray();
    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

async function deleteOneTimer(_id) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("timer");
    const result = collection.deleteOne({ _id });
    return result;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

async function insertPortOfDevice(array) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("port_of_device");
    const insertResult = await collection.insertMany(array);
    return insertResult;
  } catch (err) {
    console.log(err);
  }

  client.close();
  return true;
}

async function updatePortOfDevice(array) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("port_of_device");
    const insertResult = await collection.updateMany(array);
    return insertResult;
  } catch (err) {
    console.log(err);
  }

  client.close();
  return true;
}

async function updatePort(data) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("port_of_device");
    const insertResult = collection.updateOne(
      { _id: new ObjectId(data.id) },
      {
        $set: {
          port1: data.port1,
          port2: data.port2,
        },
      }
    );

    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

async function updatePortByPortNumber(data) {
  console.log("data: ", data);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("port_of_device");
    const insertResult = collection.updateOne(
      { order: Number(data.order), idPort: data.idPort },
      {
        $set: {
          name: data.name,
          isActive: data.isActive,
          colorPort1: data.colorPort1,
          colorPort2: data.colorPort2,
        },
      }
    );

    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

async function updateBrightnessByPortNumber(data) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("port_of_device");
    const insertResult = collection.updateOne(
      { order: Number(data.valueOrder), idPort: data.idDevice },
      {
        $set: {
          port1: data.valuePort1,
          port2: data.valuePort2,
          isActive: data.isActive,
        },
      }
    );

    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

async function getAllDevice() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("device");
    const insertResult = collection.find().toArray();
    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

async function getAllPort() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("port_of_device");
    let insertResult = await collection.find({}).toArray();
    let array = [];

    for (let item of insertResult) {
      const a = await db.collection("device").findOne({
        _id: new ObjectId(item.idDevice),
      });
      item = { ...a, ...item };
      array.push(item);
    }

    return array;
  } catch (err) {
    console.log(err);
  }
  client.close();
}

async function getAllPortIsActive() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("port_of_device");
    let insertResult = await collection.find({ isActive: "true" }).toArray();
    // let array = [];

    // for (let item of insertResult) {
    //   const a = await db.collection("device").findOne({
    //     _id: new ObjectId(item.idDevice),
    //   });
    //   item = { ...a, ...item };
    //   array.push(item);
    // }

    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
}

async function getAllPortByID(id) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("port_of_device");
    let insertResult = await collection.find({ idPort: id }).toArray();
    let array = [];

    for (let item of insertResult) {
      const a = await db.collection("device").findOne({
        _id: new ObjectId(item.idDevice),
      });
      item = { ...a, ...item };
      array.push(item);
    }

    return array;
  } catch (err) {
    console.log(err);
  }
  client.close();
}

async function findDevice(id) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("device");
    const insertResult = await collection.findOne({ _id: new ObjectId(id) });
    console.log(insertResult);
    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

async function findDeviceByID(idDevice) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("device");
    const insertResult = await collection
      .find({
        idDevice,
      })
      .toArray();
    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

async function filterHistory(data) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("history_edit");
    const insertResult = collection.find(data).toArray();
    return insertResult;
  } catch (err) {
    console.log(err);
  }
  client.close();
  return true;
}

module.exports = {
  insertDevice,
  getAllPort,
  getAllDevice,
  insertPortOfDevice,
  updatePort,
  findDevice,
  updatePortOfDevice,
  updatePortByPortNumber,
  getAllPortByID,
  findDeviceByID,
  getAllPortIsActive,
  insertHistoryEdit,
  filterHistory,
  insertTimer,
  getAllTimer,
  deleteOneTimer,
  getAllTimerIsActive,
  updateBrightnessByPortNumber,
};

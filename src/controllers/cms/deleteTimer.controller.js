const sidebarControl = require("../../services/cms/sidebarControl");
const {
  filterHistory,
  getAllDevice,
  deleteOneTimer,
} = require("../../models/connectDB");
const { ObjectId } = require("mongodb");

async function action(req, res) {
  const _id = req.body._id;
  const resDB = await deleteOneTimer(new ObjectId(_id));
  if (resDB.deletedCount === 1) {
    res.send({
      errCode: 1,
      message: "Delete timer successfully",
    });
  } else {
    res.send({
      errCode: 0,
      message: "Delete timer failure. Please try again",
    });
  }
}

exports.action = action;

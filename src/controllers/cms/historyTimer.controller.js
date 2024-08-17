const { getAllTimer } = require("../../models/connectDB");
const sidebarControl = require("../../services/cms/sidebarControl");

async function action(req, res) {
  const role_current_user = "root";
  let sidebar_data = await sidebarControl("a72", role_current_user);
  let arrayTimer  = []
   arrayTimer = await getAllTimer();
  res.render(sidebar_data.active_page.page_name, {
    ...sidebar_data,
    arrayTimer,
    layout: "./layouts/cms-layout.ejs",
  });
}

exports.action = action;

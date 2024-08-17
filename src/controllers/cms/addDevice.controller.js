const sidebarControl = require("../../services/cms/sidebarControl");
const { getAllPort, getAllDevice } = require("../../models/connectDB");
async function action(req, res) {
  const role_current_user = "root";

  let sidebar_data = await sidebarControl("a6", role_current_user);
  res.render(sidebar_data.active_page.page_name, {
    ...sidebar_data,
    layout: "./layouts/cms-layout.ejs",
  });
}

exports.action = action;
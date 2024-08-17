const sidebar_content = require('~/config/cms-sidebar.json');
const block_table_json = require('~/config/table-role.json').block;

const getSidebarContent = async (page_id, user_type) => {
  // (<page_id_now>,<user_type>)

  // console.log(sidebar_content)
  let active_page = undefined;
  let page_parent_active;
  let block_table = block_table_json[user_type];
  // console.log(block_table)

  let error_page = {
    active_page: {
      title: 'Lỗi',
      page_name: './cms-page/error',
      page_parent_active: 'a0',
      page_id: 'a0'
    },
    sidebar: sidebar_content
  };

  try {
    for (const key of sidebar_content) {
      if (active_page == undefined) {
        if (key.child.length > 0) {
          page_parent_active = key.page_id;
          if (key.page_id == page_id) {
            // page_parent_active = key.page_id
            active_page = key;
            break;
          } else {
            for (const key2 of key.child) {
              if (key2.page_id == page_id) {
                active_page = key2;
                break;
              }
            }
          }
        } else {
          if (key.page_id == page_id) {
            page_parent_active = key.page_id;
            active_page = key;
            break;
          }
        }
      } else {
        break;
      }
    }
  } catch (error) {
    console.log(error);
    return error_page;
  }
  // console.log("ssss", active_page)
  if (active_page != undefined) {
    return {
      active_page: {
        title: active_page.title,
        page_name: active_page.page_name,
        parent_id: page_parent_active,
        page_id: active_page.page_id
      },
      sidebar: sidebar_content,
      block_table: block_table
    };
  } else {
    return error_page;
  }
};

module.exports = getSidebarContent;

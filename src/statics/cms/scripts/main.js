var socket = io("127.0.0.1:3000");
// Listen for 'chat message' event
socket.on("data", function (msg) {
  const { data, topic } = msg;
  // console.log("msg", msg);
  setPortOfDevice(topic, data);
});

socket.on("temp", function (data) {
  console.log("temp", data);
  $("#temp-value").text(data.temperature);
  $("#humi-value").text(data.humidity);

  if (data.temperature > 30) {
    $.ajax({
      url: "/edit/turn-off",
      type: "POST",
      success: function (result) {},
    });
  }
});

function setPortOfDevice(topic, data) {
  if (data && topic) {
    const data1 = data.split(",");
    const order = data1[0];
    const port1 = data1[1];
    const port2 = data1[2];

    // $(`.port1-${topic}-${order}`).setAttribute("value", port1);
    $(`.port2-${topic}-${order}`).val(port2);
    $(`.port1-${topic}-${order}`).val(port1);
    $(`#port1-value-${topic}-${order}`).text(port1);
    $(`#port2-value-${topic}-${order}`).text(port2);
  }
}

let click_status = true;
$(".my-dropdown-button").click(function () {
  /*
    ===== dropdown menu
        <a class="my-dropdown-button"  dropdown-menu-name="#profile" ></a>
        <div class="dropdown-child-buble" id="profile"></div>
        dropdown-child-buble : close when click out
    */
  click_status = false;
  let menu_id = $(this).attr("dropdown-menu-name");
  $(menu_id).toggleClass("d-none d-flex");
  $(this).toggleClass("dropdown-btn-active");
  setTimeout(() => {
    click_status = true;
  }, 1000);
});

$(window).click(function () {
  if (click_status) {
    $(".dropdown-btn-buble").removeClass("dropdown-btn-active");
    $(".dropdown-child-buble").addClass("d-none");
  }
});

function handleEditPort(e) {
  let array = [];
  $(`.${e}`).each(function (index, element) {
    let name = element.querySelector(`.ip-name-${e}-${index}`).value.trim();
    let order = element.querySelector(`.ip-order-${e}-${index}`).value.trim();
    let isActive = $(`.ip-active-${e}-${index}`).prop("checked");
    let colorPort1 = $(`#color-port-1-${e}-${index}`).val();
    let colorPort2 = $(`#color-port-2-${e}-${index}`).val();
    array.push({
      name,
      order,
      isActive,
      idPort: e,
      colorPort1,
      colorPort2,
    });
  });

  // for (const item of array) {
  //   if (item.name === "" || item.order === "") {
  //     alert("Missing input");
  //     return;
  //   }
  // }

  $.ajax({
    url: "/edit-device/update",
    type: "POST",
    data: { data: array },
    success: function (result) {
      $(".modal-id").append(modal(result));
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    },
  });
}

function handleCloseModal() {
  $("#modal-notification").remove();
}

function handleOCBrightness(e) {
  console.log(e);
}

function onChangeBN(e, i) {
  $(`.value-brightness-${i}`).text(e);
}

function onInput(e, i) {
  $(`.value-brightness-${i}`).text(e);
}

function handleAddNewDevice() {
  const idDevice = document.getElementById("id-device").value;
  const type = $("input[name='type-device']:checked").val();

  const data = { idDevice, type };

  $.ajax({
    url: "add-device/add-mqtt-device",
    type: "POST",
    data,
    success: function (result) {
      const { errCode, message } = result;
      if (errCode === 0) {
        document.getElementById("id-device").value = "";
        $("input[name=type-device]").prop("checked", false);
      }
      $(".modal-id").append(modal(message));
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    },
  });
}

function handleDecrease(i, order, id, idPort) {
  if (Number($(`#brightnessRange-${i}`).val()) >= 1) {
    const val = Number($(`#brightnessRange-${i}`).val()) - 1;
    document.getElementById(`brightnessRange-${i}`).value = val;
    $(`.value-brightness-${i}`).text(val);
    command(idPort, order, id);
  }
  processChange();
}

function handleOnChangeInput(order, id, idPort) {
  command(idPort, order, id);

  processChange();
}

function handleIncrease(i, order, id, idPort) {
  if (Number($(`#brightnessRange-${i}`).val()) <= 99) {
    const val = Number($(`#brightnessRange-${i}`).val()) + 1;
    document.getElementById(`brightnessRange-${i}`).value = val;
    $(`.value-brightness-${i}`).text(val);
    command(idPort, order, id);
  }
  processChange();
}

function handleSavePort(id, idDevice, order) {
  return { idDevice, order, id };
  // let port1 = $(`.value-brightness-${id}-port1`).text();
  // let port2 = $(`.value-brightness-${id}-port2`).text();

  // const data = { port1, port2, id, idDevice, order };
  // console.log(data);
  // $.ajax({
  //   url: "/control/edit",
  //   type: "POST",
  //   data,
  //   success: function (result) {
  //     // $(".modal-id").append(modal(result));
  //     // setTimeout(() => {
  //     //   handleCloseModal();
  //     // }, 1500);
  //     console.log(result);
  //   },
  // });
}

function savePort() {
  const elements = document.querySelectorAll(".btn-save");
  let arrayData = [];
  if (elements) {
    elements.forEach(function (element) {
      const dataPort = $(element).attr("data");
      const array = dataPort.split(",");
      const id = array[0];
      const idDevice = array[1];
      const order = array[2];

      let port1 = $(`.value-brightness-${id}-port1`).text();
      let port2 = $(`.value-brightness-${id}-port2`).text();

      const data = { port1, port2, id, idDevice, order };
      arrayData.push(data);
    });

    console.log(arrayData);

    $.ajax({
      url: "/control/edit",
      type: "POST",
      data: { data: JSON.stringify(arrayData) },
      success: function (result) {
        // $(".modal-id").append(modal(result));
        // setTimeout(() => {
        //   handleCloseModal();
        // }, 1500);
      },
    });
  }
}

function findPortByUSB() {
  $.ajax({
    url: "/add-device/find",
    type: "GET",
    success: function (result) {
      if (result.length > 0) {
        for (const item of result) {
          const { id, isUse } = item;
          const template = $(`
          <div class="port-wrapper mt-2 wrapper-${id}  " >
              <div class=" pt-4 pb-2 pl-4 pr-4 d-flex col-12 mt-2 justify-content-between "  >
                <p class="d-flex align-items-center col-5">ID USB: <label class="value-id-${id} ml-1">${id}</label></p>
                <p class="d-flex align-items-center col-3">Status: <label class="value-status-${id} ml-1">${isUse ? "Use" : "Not use"}</label></p>
                <button class="btn btn-primary col-3 " onclick="getInfoUSB(${id},this)">Lấy thông tin</button>
              </div>
              <div class=" pb-4 pt-2 pl-4 pr-4 d-flex justify-content-between col-12 ">
                <div class= " d-flex align-items-center col-5  id-port-${id}">
                </div>
                <div class= " d-flex align-items-center col-3  max-port-${id}">
                </div>
                <button class= "d-none btn-save-${id} col-3 btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="saveDevice(${id},this)">Save</button>
              </div>
          </div>
            `);
          $(".list-port-1").append(template);
        }
      }
    },
  });
}

function getInfoUSB(idPort, btn) {
  $.ajax({
    url: "/add-device/get-info",
    type: "GET",
    data: { idPort },
    success: function (result) {
      let { id, maxPort, idPort } = result;
      const template = $(`
        <p class="d-flex align-items-center">Max port: <label class="value-max-port-${id} ml-1">${maxPort}</label></p>
      `);
      const template1 = $(
        `<p class="d-flex align-items-center">ID port: <label class="value-id-port-${id} ml-1">${idPort}</label></p>`
      );
      $(`.max-port-${id}`).append(template);
      $(`.id-port-${id}`).append(template1);
      $(`.btn-save-${id}`).removeClass("d-none");
      btn.disabled = true;
    },
  });
}

function saveDevice(id, btn) {
  const idUSB = $(`.value-id-${id}`).text();
  const maxPortUSB = $(`.value-max-port-${id}`).text();
  const idPort = $(`.value-id-port-${id}`).text();
  const data = { idUSB, maxPortUSB, idPort };
  $.ajax({
    url: "/add-device/add",
    type: "POST",
    data,
    success: function (result) {
      $(".modal-id").append(modal(result));
      setTimeout(() => {
        handleCloseModal();
      }, 1500);

      btn.disabled = true;
    },
  });
}

function handleFilter1() {
  const fromDate = $(`#from-date`).val();
  const toDate = $(`#to-date`).val();
  var arrayIdPort = [];

  $(`.cb-id-port`).each(function (i, e) {
    if ($(e).prop("checked")) {
      arrayIdPort.push($(e).val());
    }
  });
  const data = { fromDate, toDate, arrayIdPort };

  if (arrayIdPort.length == 0) {
    alert("Port is required");
    return;
  }
  $.ajax({
    url: "/data/filter",
    type: "POST",
    data,
    success: function (result) {
      $(".list-filter").remove(".list-filter");
      const div = document.createElement("div");
      div.setAttribute("class", "list-filter");

      $("#result").append(div);
      filterTemplate(result);

      $(".btn-download").removeClass("d-none");
    },
  });
}

function command(idDevice, order, id) {
  let p = $(`.input-${order}`);
  let p1 = $(`.value-brightness-${id}-port1`).text();
  let p2 = $(`.value-brightness-${id}-port2`).text();
  const data = { topic: idDevice, data: `${order},${p1},${p2}` };

  $.ajax({
    url: "/control-device/custom-led",
    type: "POST",
    data,
    success: function (result) {},
  });
}

function handleExportData() {
  const fromDate = $(`#from-date`).val();
  const toDate = $(`#to-date`).val();
  var arrayIdPort = [];

  $(`.cb-id-port`).each(function (i, e) {
    if ($(e).prop("checked")) {
      arrayIdPort.push($(e).val());
    }
  });
  const data = { fromDate, toDate, arrayIdPort };
  if (arrayIdPort.length == 0) {
    alert("Port is required");
    return;
  }
  let stringArrayIdPort = "";
  for (let i = 0; i < arrayIdPort.length; i++) {
    stringArrayIdPort += `&arrayIdPort=${arrayIdPort[i]}`;
  }
  $.ajax({
    url: "/export-csv",
    type: "get",
    data,
    success: function (result) {
      var link = document.createElement("a");
      link.href = `http://localhost:8002/export-csv?fromDate=${fromDate}&toDate=${toDate}${stringArrayIdPort}`;
      link.target = "_blank";
      link.click();
    },
  });
}

function modal(result) {
  return `<div class="modal fade show" id="modal-notification" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" style="display: block;" aria-modal="true">
  <div class="modal-dialog " role="document">
    <div class="modal-content">
     
      <div class="modal-body">
      <div class="d-flex justify-content-between align-items-center">
         ${result}
         <button type="button" class="btn btn-primary" onclick="handleCloseModal()" data-dismiss="modal" >Đóng</button>
      </div>

      </div>
    </div>
  </div>
</div>`;
}

function filterTemplate(result) {
  $(".list-filter").append(
    `<p>port1,port2,brightness,idPort,idDevice,timestamp</p>`
  );
  for (const item of result) {
    for (const item1 of item) {
      $(".list-filter").append(
        ` <p>
          ${item1.port1},${item1.port2},${item1.brightness},${item1.id},
          ${item1.port},${item1.timestamp}
        </p>`
      );
    }
  }
}
let filter = [];
function handleChoseIdDevice(value, portArray) {
  const array = value.value.split(",").map((item) => item.trim());
  const a = portArray;
  filter = portArray.filter(
    (i) => i.idPort === array[0] && i.isActive === "true"
  );
  const template = filter.map((item) => {
    return `
    <option value=${item.order} id="element-name">${item.name}</option>`;
  });
  const list = document.getElementById("name-order");

  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
  $("#name-order").append(template);

  var elements = document.querySelectorAll(".port-color");

  // Loop through the NodeList and remove each element
  if (elements) {
    elements.forEach(function (element) {
      element.remove();
    });
  }

  if (filter[0]) {
    const templateColorPort1 = `
    <p class="ml-2 p-2 port-color port-color-${filter[0].colorPort1}" style="width: 10px;"></p>
    `;
    const templateColorPort2 = `
    <p class="ml-2 p-2 port-color port-color-${filter[0].colorPort2}" style="width: 10px;"></p>
    `;

    $(`.port2-ip-timer`).append(templateColorPort2);
    $(`.port1-ip-timer`).append(templateColorPort1);
  }
}

function handleChangeColor() {
  var elements = document.querySelectorAll(".port-color");

  // Loop through the NodeList and remove each element
  if (elements) {
    elements.forEach(function (element) {
      element.remove();
    });
  }
  const valueOrder = $("#name-order").val();

  const data = filter.filter((i) => i.order === Number(valueOrder));

  const templateColorPort1 = `
  <p class="ml-2 p-2 port-color port-color-${data[0].colorPort1}" style="width: 10px;"></p>
`;
  const templateColorPort2 = `
  <p class="ml-2 p-2 port-color port-color-${data[0].colorPort2}" style="width: 10px;"></p>
`;
  $(`.port2-ip-timer`).append(templateColorPort2);
  $(`.port1-ip-timer`).append(templateColorPort1);
}

function validateInputTimer(value, type) {
  const val = value.value;
  switch (type) {
    case "p1":
      if (val > 100 || val < 0) {
        $(".lb-port1").removeClass("d-none");
      } else {
        $(".lb-port1").addClass("d-none");
      }
      break;
    case "p2":
      if (val > 100 || val < 0) {
        $(".lb-port2").removeClass("d-none");
      } else {
        $(".lb-port2").addClass("d-none");
      }
      break;
    case "hh":
      if (val > 24 || val < 0) {
        $(".lb-hour").removeClass("d-none");
      } else {
        $(".lb-hour").addClass("d-none");
      }
      break;
    case "mm":
      if (val > 59 || val < 0) {
        $(".lb-minute").removeClass("d-none");
      } else {
        $(".lb-minute").addClass("d-none");
      }
      break;
    default:
  }
}

function submitTimer() {
  const idDevice = $("input[name='idDevice']:checked").val();
  // const array = dataDevice.split(",").map((item) => item.trim());
  // const idDevice = array[0];

  const valueOrder = $("#name-order").val();
  const valuePort1 = document.getElementById("ip-p1").value;
  const valuePort2 = document.getElementById("ip-p2").value;
  const valueHour = document.getElementById("ip-hh").value;
  const valueMinute = document.getElementById("ip-mm").value;
  // const status = $("input[name='status']:checked").val();

  if (
    valueOrder === "" ||
    valuePort1 === "" ||
    valuePort2 === "" ||
    valueHour === "" ||
    valueMinute === "" ||
    idDevice === ""
  ) {
    $(".modal-id").append(modal("The value is not empty"));
    setTimeout(() => {
      handleCloseModal();
    }, 1500);
    return;
  }

  if (
    valueOrder < 0 ||
    valuePort1 > 100 ||
    valuePort1 < 0 ||
    valuePort2 > 100 ||
    valuePort2 < 0 ||
    valueHour > 23 ||
    valueHour < 0 ||
    valueMinute > 60 ||
    valueMinute < 0
  ) {
    $(".modal-id").append(modal("The value is incorrect"));
    setTimeout(() => {
      handleCloseModal();
    }, 1500);
    return;
  } else {
    const data = {
      idDevice,
      valueOrder,
      valuePort1,
      valuePort2,
      valueHour,
      valueMinute,
      status: "active",
    };

    $.ajax({
      url: "/timer/set",
      type: "POST",
      data: data,
      success: function (result) {
        $(".modal-id").append(modal(result));
        setTimeout(() => {
          handleCloseModal();
        }, 1500);

        setTimeout(() => {
          // location.reload();
        }, 1500);
      },
    });
  }
}

function handleDeleteTimer(_id) {
  const data = { _id };
  $.ajax({
    url: "/timer/history",
    type: "POST",
    data: data,
    success: function (result) {
      if (result.errCode === 1) {
        $(`.id-device-${_id} `).addClass("d-none");
      }
      $(".modal-id").append(modal(result.message));
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    },
  });
}

const timeoutDebounce = 3000;
function debounce(func, timeout = timeoutDebounce) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function saveInput() {
  // $(".btn-save").click();
  savePort();
  $(".modal-id").append(modal("Save data"));
  setTimeout(() => {
    handleCloseModal();
  }, 1500);
}
const processChange = debounce(() => saveInput());

// const setTime = setInterval(() => {
//   window.location.reload();
// }, 3600000);

//add new device and port
// var i = 0;
// $(".add-port-btn").click(function () {
//   const template = $(
//     ` <div class="port-wrapper p-4 d-flex flex-wrap col-12 mt-2">
//   <div class="col-4 mt-2">
//        <label class="label-port" for="">Id port: </label>
//        <input type="text" class="ip-port-${i}" >
//   </div>
//   <div class="col-4 mt-2">
//    <label class="label-port" for="">Status port 1: </label>
//        <select id="port-1-${i}" class="form-select ip-select" aria-label="Default select example">
//            <option selected value="true">On</option>
//            <option value="false">Off</option>
//        </select>
//  </div>
//   <div class="col-4 mt-2 ">
//        <label for="brightnessRange" class="form-label-${i}">Brightness: 50 </label>
//        <input id="ip-brightness-value-${i}" type="range"  oninput="onInput(this.value,${i})"
//        onchange="onChangeBN(this.value,${i})" class="form-range ip-select" min="0" max="100" step="1" id="brightnessRange">
//    </div>
//   <div class="col-4 mt-2 ">
//    <label class="label-port" for="">Port number: </label>
//    <input type="text" id="ip-port-number-${i}" >
// </div>
// <div class="col-4 mt-2">
//    <label class="label-port" for="">Status port 2: </label>
//        <select id="port-2-${i}" class="form-select ip-select" aria-label="Default select example">
//            <option selected value="true">On</option>
//            <option value="false">Off</option>
//        </select>
//  </div>
// </div>`
//   );
//   $(".list-port").append(template);
//   i++;
// });

// $(".save-btn").click(function () {
//   i = 0;
//   const idDevice = $(".id-device").val();
//   const arrayPort = [];
//   $(".port-wrapper").each(function (index, e) {
//     const id = e.querySelector(`.ip-port-${index}`).value;
//     const port1 = e.querySelector(`#port-1-${index}`).value;
//     const port2 = e.querySelector(`#port-2-${index}`).value;
//     const brightness = e.querySelector(`#ip-brightness-value-${index}`).value;
//     const portNumber = e.querySelector(`#ip-port-number-${index}`).value;

//     const data = {
//       id,
//       port1,
//       port2,
//       brightness,
//       portNumber,
//     };

//     arrayPort.push(data);
//   });
//   const data = { arrayPort, idDevice };
//   console.log(data);

//   $.ajax({
//     url: "/control/add",
//     type: "POST",
//     data: data,
//     success: function (result) {
//       alert(result.message);
//       location.reload();
//     },
//   });
// });

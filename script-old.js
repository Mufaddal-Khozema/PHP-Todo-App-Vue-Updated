// Debounce Function for Dragmove
// const debounce = (func, wait = 40, immediate = true) => {
//   let timeout;

//   return (...args) => {
//     const context = this;
//     const later = () => {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };

//     const callNow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);

//     if (callNow) func.apply(context, args);
//   };
// };
// const form = document.querySelector("form");
// const del = document.querySelectorAll(".deletetab");
const done = document.querySelectorAll(".donetab");
const color = document.querySelectorAll(".colortab");

let curOrder = getItemsId();
// const spans = list.querySelectorAll(".item span");



async function fetchRequest(location, formData) {
    const response = await fetch(`${location}`, {
        method: "POST",
        body: formData,
    });
    const json = await response.json();
    return json;
}

function createTask(e) {
    const text = form.querySelector("input[type=text]");
  var formData = new FormData();
  formData.append("text", text.value);
  
  fetchRequest("/create", formData)
    .then((data) => {
        console.log(data);
        if (data["error"]) {
            if (form.querySelector(".dim-alert")) {
                form.querySelector(".dim-alert").remove();
            }
            const exception = document.createElement("p");
            exception.classList.add("dim-alert");
            form.insertBefore(exception, text);
            exception.textContent = data["error"];
        } else if (data["success"]) {
            location.reload();
        }
})
    .catch((error) => {
        console.log("Request error:", error);
        // Handle the error
    });
}

function askForDoubleClick(e) {
    const item = e.target;
    
    item.addEventListener("click", deleteItem);
    
    if (!item.classList.contains("reveal")) {
        item.classList.add("reveal");
    } else {
        item.classList.remove("reveal");
    }
    
    setTimeout(() => {
    item.removeEventListener("click", deleteItem);
}, 2000);
}

function deleteItem(e) {
    var formData = new FormData();
    formData.append("id", e.target.id);
    const listItem = e.target.parentNode;
    
    fetchRequest("/delete", formData)
    .then((data) => {
        if (data["success"]) {
            listItem.classList.add("hidden");
            setTimeout(() => (listItem.style.display = "none"), 600);
        curOrder = getItemsId();
    } else if (data["error"]) {
        console.log(data["error"]);
    }
})
.catch((error) => {
    console.log("Request error:", error);
    // Handle the error
});
}

function handleDone(e) {
    const listItem = e.target.parentNode.querySelector("span");
    var formData = new FormData();
    formData.append("id", e.target.id);
    fetchRequest("/done", formData)
    .then((data) => {
        console.log(data);
        if (data["success"]) {
            if (data["is_checked"]) listItem.classList.add("crossout");
            else listItem.classList.remove("crossout");
        } else {
            console.log(data["error"]);
        }
    })
    
    .catch((error) => {
        console.log("Request error:", error);
    });
}

function changeColor(e) {
    const listItem = e.target.parentNode;
    const validColors = ["colorRed", "colorGreen", "colorBlue", "colorYellow"];
    var formData = new FormData();
    formData.append("id", e.target.id);
    fetchRequest("/color", formData)
    .then((data) => {
        if (data["success"]) {
            console.log(data);
            // Removes any color that was set before
            listItem.classList.forEach((item) => {
                if (validColors.includes(item)) listItem.classList.remove(item);
            });
            listItem.classList.add(`${data["next_color"]}`);
        } else if (data["error"]) {
            console.log(data["error"]);
        }
    })
    .catch((error) => {
      console.log("Request error:", error);
    });
}

function getItemsId() {
    const items = document.querySelectorAll(".item");
    const order = Array.from(items).map((item) => item.id);
    return order;
}

function changePositions(e) {
    console.log("here");
    e.preventDefault();
    
    const list = document.querySelector(".list");
    const draggingItem = list.querySelector(".dragging");
    let siblings = [...list.querySelectorAll(".item:not(.dragging)")];
    let nextSibling = siblings.find((sibling) => {
        return e.pageY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    list.insertBefore(draggingItem, nextSibling);

    const updatedOrder = getItemsId();
    // Check if new order of elements before and after dragging is different
    let isOrderDifferent = false;
    for (let i = 0; i < updatedOrder.length; i++) {
        if (curOrder[i] !== updatedOrder[i]) isOrderDifferent = true;
    }

    // Only calling if order is different
  if (isOrderDifferent) {
    // console.log(JSON.stringify(updatedOrder));
    var formData = new FormData();
    formData.append(`new_order`, JSON.stringify(updatedOrder));

    fetchRequest("/positions", formData)
      .then((data) => {
        // console.log(data);
        if (data["error"]) {
          console.log(data["error"]);
        }
      })
      .catch((error) => {
        console.log("Request error:", error);
      });
  }
};

function handleSpan(e) {
  const span = e.target;
  span.setAttribute("contenteditable", "true");
  span.textContent = span.textContent.trim();
  span.addEventListener("keypress", handleEdit);
};

function handleEdit(e)  {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission or other default behavior
    const span = e.target;
    const li = span.parentNode;
    // Enter key is pressed
    const inputValue = span.textContent;
    var formData = new FormData();

    formData.append("id", span.id);
    formData.append("text", inputValue);
    fetchRequest("/text", formData)
      .then((data) => {
        if (data["error"]) {
          if (li.querySelector(".dim-alert")) {
            li.querySelector(".dim-alert").remove();
          }
          const exception = document.createElement("p");
          li.appendChild(exception);
          exception.classList.add("dim-alert");
          exception.textContent = data["error"];
        } else {
          li.querySelector("p") ? li.querySelector("p").remove() : null;
          span.textContent = data["text"];
          span.setAttribute("contenteditable", "false");
        }
      })
      .catch((error) => {
        console.log("Request error:", error);
      });
  }
};

// del.forEach(item => item.addEventListener("click", askForDoubleClick));
// del.forEach((item) => item.addEventListener("dblclick", deleteItem));
done.forEach((item) => item.addEventListener("click", handleDone));
color.forEach((item) => item.addEventListener("click", changeColor));

// list.addEventListener("dragenter", (e) => e.preventDefault());
// list.addEventListener("dragover", debounce(changePositions));
// spans.forEach((span) => span.addEventListener("dblclick", handleSpan));
// form.addEventListener("submit", createTask);
const { createApp, ref, reactive, computed } = Vue;
import myComponent from './list-items.js';
// import myComponent from './myComponent2.js';

// createApp({


//   setup() {
      
//         const dragstart = (e) => {
//             e.target.parentNode.classList.add("dragging");
//           }
//         const dragend = (e) => {
//             e.target.parentNode.classList.remove("dragging");
//           }


//     const todos = reactive(phpTodos);
//     const name = "Mufaddal";
//     const isChecked = (is_checked) => {
//       if (is_checked === 1) return "crossout";
//     }

//     return {
//         todos,
//         dragend,
//         dragstart,
//         createTask,
//         deleteItem,
//       changeColor,
//       handleDone,
//       isChecked,
//       handleSpan,
//       changePositions,
//       askForDoubleClick
//     }
//   }
// }).mount('#app');
createApp(myComponent).mount('#app')
const { createApp, reactive, computed } = Vue;
import listItems from "./list-items.js";
import todoInsert from "./todoInsert.js";
const app = createApp({
  data() {
    return {
      list: null,
      todos: [
        {
          id: 114,
          text: "Hello",
          is_checked: 0,
          color: "colorRed",
          position: 3,
          time: "2023-07-13 12:32:26",
          clicks: 0,
          timer: null,
          dragging: false,
          removed: false,
          element: null,
        },
        {
          id: 115,
          text: "Mashallah",
          is_checked: 1,
          color: "colorRed",
          position: 4,
          time: "2023-07-13 12:32:31",
          clicks: 0,
          timer: null,
          dragging: false,
          removed: false,
          element: null,
        },
        {
          id: 116,
          text: "Hey",
          is_checked: 0,
          color: "colorRed",
          position: 5,
          time: "2023-07-13 12:37:08",
          clicks: 0,
          timer: null,
          dragging: false,
          removed: false,
          element: null,
        },
      ],
      name: "Mufaddal",      
    };
  },
  components: {
    listItems,
  },
  mounted() {
      this.list = this.$refs.list;
      
  }
});
app.component("list-items", listItems);
app.component("todo-insert", todoInsert);
app.mount("#main");

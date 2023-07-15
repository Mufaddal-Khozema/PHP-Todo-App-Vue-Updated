export default {
  props: {
    todos: Array,
  },
  data() {
    return {
      text: ''
    }
  },
  
  
  methods: {
    findMaxId() {
      let maxId = this.todos[0].id;
        this.todos.forEach(todo => {
          if(todo.id > maxId){
            maxId = todo.id
          }
        }, this.todos[0].id);
      return maxId;
    },
    findMaxPos() {
      let maxPos = this.todos[0].position;
        this.todos.forEach(todo => {
          if(todo.position > maxPos){
            maxPos = todo.position
          }
        }, this.todos[0].position);
      return maxPos;
    },
    // {
  //   id: 115,
  //   text: "Mashallah",
  //   is_checked: 1,
  //   color: "colorRed",
  //   position: 4,
  //   time: "2023-07-13 12:32:31",
  //   clicks: 0,
  //   timer: null,
  //   dragging: false,
  //   removed: false,
  //   element: null,
  // }
    createTask(e) {
      // console.log(maxId);
      this.todos.push({
        id: this.findMaxId() + 1,
        text: e.target.elements["new-list-item-text"].value,
        is_checked: 0,
        color: "colorRed",
        position: this.findMaxPos() + 1,
        time: (new Date).toString(),
        clicks: 0,
        timer: null,
        dragging: false,
        removed: false,
        element: null,
      })
      e.target.elements["new-list-item-text"].value = ''
    }
  },
  template: `
   	 
          <div id="form" class="form">
            <form id="add-new" @submit.prevent="createTask" method="" autocomplete="off">
              <input type="text" id="new-list-item-text" :value="text" name="text" placeholder="What do you want to do"/>
              <input type="submit" id="add-new-submit" value="Add" class="button" />
            </form>

          </div>
  `,
  beforeUpdate() {
      this.todos.forEach((todo, i) => todo.element = this.$refs.todos[i]);
      this.list = this.$parent.list;
  }
};

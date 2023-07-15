export default {
  props: {
    todos: Array,
  },
  data() {
    return {
      elementToDrag: null,
      list: null,
      alreadyClickedOnce: false,
      validColors: ["colorRed", "colorGreen", "colorBlue", "colorYellow"],
    };
  },
  methods: {
    findTodo(id) {
      return this.todos.find(todo => todo.id == id);
    },
    getNxtColor(color) {
      if(this.validColors.includes(color)) {
        const idx = this.validColors.indexOf(color) + 1;
        const nextColor = this.validColors[idx];
        return nextColor ? nextColor : this.validColors[0];
        return 
      }
    },
    changeColor(e) {
      const eventTodo = this.findTodo(e.target.id);
      eventTodo.color = this.getNxtColor(eventTodo.color);
    },
    handleDone(e) {
      const eventTodo = this.findTodo(e.target.id);
      eventTodo.is_checked = eventTodo.is_checked === 0 ? 1 : 0;
    },

    deleteItem(e) {
      const eventTodo = this.findTodo(e.target.id);
      eventTodo.clicks++
      if(eventTodo.clicks === 1) {
        eventTodo.timer = setTimeout( () => {eventTodo.timer = null}, 2000);
      } else {
        if(eventTodo.timer){
          eventTodo.removed = !eventTodo.removed
          eventTodo.clicks = 0;
        }
        
        eventTodo.clicks = 0;
      }
    },
    changePositions(e) {
      const eventTodo = this.findTodo(e.target.id);
      const siblings = this.todos.filter(todo => todo.dragging != true);
      let nextSibling = siblings.find((sibling) => {
        return e.pageY <= (sibling.element.offsetTop + sibling.element.offsetHeight / 2);
      });
      this.list.insertBefore(this.elementToDrag.element, nextSibling?.element);
    },
    dragStart(e) {
      const eventTodo = this.findTodo(e.target.id);
      eventTodo.dragging = true;
      this.elementToDrag = eventTodo;
    },
    dragEnd(e) {
      const eventTodo = this.findTodo(e.target.id);
      this.elementToDrag = null;
      eventTodo.dragging = false;
    },
    handleSpan(e) {
      // console.log(e);
      const eventTodo = this.findTodo(e.target.id);
      e.target.blur();
      eventTodo.text = this.$refs.span.innerText.trim()
    }

  },
  template: `
  <li 
    v-for="todo in todos" 
    :id="todo.id" 
    :data-color="todo.color" 
    @dragenter.prevent 
    @dragstart="dragStart" 
    @dragend="dragEnd" 
    :class="[todo.color, {dragging: todo.dragging}]" 
    class="item" rel="1"
    v-show="todo.removed === false"
    ref="todos"
  >
 
    <div 
      :id="todo.id" 
      @dragover.prevent="changePositions"  
      class="draggertab tab" 
      draggable="true"
    ></div>

    <div 
      :id="todo.id" 
      @click="changeColor" 
      class="colortab tab"
    ></div>

    <span 
      :id="todo.id" 
      :class="{crossout: todo.is_checked == 1}" 
      class="tab" 
      title="Double-click to edit..." 
      contenteditable
      @keydown.enter.prevent="handleSpan"
      ref="span"
    >
    {{todo.text}}
    </span>

    <div 
      :id="todo.id" 
      @click="handleDone" 
      class="donetab tab"
    ></div>

    <div 
      :id="todo.id" 
      @click="deleteItem" 
      :class="{reveal: todo.clicks === 1}" 
      class="deletetab tab"
    ></div>
  
  </li>
  `,
  beforeUpdate() {
      this.todos.forEach((todo, i) => todo.element = this.$refs.todos[i]);
      this.list = this.$parent.list;
  }
};
// askForDoubleClick
import './main.scss'

interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
}

const DOM_FORMULARIO: HTMLElement | null = document.querySelector('#formulario')
const DOM_TODO: HTMLElement | null = document.querySelector("#todo");
const DOM_BTN_FILTER: HTMLInputElement[] = Array.from(document.querySelectorAll("input[type='radio']"));
const DOM_FILTER: HTMLElement | null = document.querySelector("#btn-filter");

let todo: Array<TodoItem> = [{
  id: Date.now(),
  task: 'Cliente nuevo',
  completed: false
}]

const handleFilter = () => {
  const checkedBtn = DOM_BTN_FILTER.find(btn => btn.checked);
  const data = checkedBtn?.value;


  const filterTodo = todo.filter(item => {
    if (data === 'complete') {
      return item.completed === true && item;
    } else if (data === 'incomplete') {
      return item.completed === false && item;
    } else {
      return item;
    }
  });

  handleRenderTodo(filterTodo);
}

const handleAddTodo = (e: any) => {
  e.preventDefault()

  const item: string = e.target[0].value

  const newTask: TodoItem = {
    id: Date.now(),
    task: item,
    completed: false,
  };

  todo = [...todo, newTask]

  handleRenderTodo(todo)
  e.target[0].value = ''
}

const clearTodoList = () => {
  if (DOM_TODO) {
    DOM_TODO.innerHTML = "";
  }
}

const handleDelete = (id: number): void => {
  todo = todo.filter(todo => todo.id !== id)
  handleRenderTodo(todo)
}

const handleCompleted = (id: number): void => {

  const changeStatus: TodoItem | undefined = todo.find(todo => todo.id === id) as TodoItem

  const { completed } = changeStatus

  if (changeStatus) {
    todo = todo.map(item => {
      if (item.id === id) {
        return {
          ...item,
          completed: !completed
        }
      } else {
        return item
      }
    })
  }

  handleFilter()
}

const handleEdit = (id: number) => {
  const todoItem = document.querySelector(`li[data-id="${id}"]`) as HTMLElement;
  const title = todoItem.querySelector(".task") as HTMLElement;
  const editInput = todoItem.querySelector(".edit-input") as HTMLInputElement;

  if (title && editInput) {
    title.style.display = "none";
    editInput.style.display = "inline-block";
    editInput.focus();
    editInput.select();
    editInput.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const newTask = editInput.value;
        todo = todo.map((item) => {
          if (item.id === id) {
            return { ...item, task: newTask };
          } else {
            return item;
          }
        });
        handleRenderTodo(todo);
        title.style.display = "inline-block";
        editInput.style.display = "none";
      }
    });
  }
};

const handleRenderTodo = (todo: TodoItem[]) => {

  clearTodoList()


  if (todo.length === 0) {

    const no_html = document.createElement('h2')
    no_html.textContent = 'No hay task'

    DOM_TODO?.appendChild(no_html);
  }

  if (DOM_TODO) {
    const todoList = document.createElement("ul");
    todo.forEach(({ id, task, completed }) => {
      const todoItem = document.createElement("li");
      todoItem.setAttribute('data-id', `${id}`);
      todoItem.classList.add('item-child')
      todoItem.innerHTML = `
        <h2 class='task'>${task}</h2>
        <input class="edit-input" data-id="${id}" type="text" value="${task}">

        <input type="checkbox" class='check'  ${completed ? "checked" : ""}>

        <div class="flex">
          <button class="btn delete" data-id="${id}" type="button">Delete</button>
          <button class="btn edit" data-id="${id}" type="button">Edit</button>
        </div>
      `;
      const deleteButton = todoItem.querySelector(".delete");
      const editButton = todoItem.querySelector(".edit");
      const checkButton = todoItem.querySelector(".check");

      deleteButton?.addEventListener("click", () => handleDelete(id));
      editButton?.addEventListener("click", () => handleEdit(id));
      checkButton?.addEventListener("click", () => handleCompleted(id));

      todoList.appendChild(todoItem);
    });

    DOM_TODO.appendChild(todoList);
  }
}



handleFilter()
DOM_FORMULARIO?.addEventListener('submit', handleAddTodo)
DOM_FILTER?.addEventListener('click', handleFilter)
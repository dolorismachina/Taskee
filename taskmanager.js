import { saveTasksToLocalStorage } from './app.js';
import { createTaskHtml } from './taskmaker.js';
import EventHandler from './event-handler.js';

class TaskManager {
  constructor(task, parentTask, element) {
    this.task = task;
    this.parentTask = parentTask;
    this.element = element;
    
    this.editing = false;

    this.element.addEventListener('keypress', this.handleKeypress.bind(this));
    this.element.addEventListener('click', e => EventHandler.handleClick(e, this));
    this.element.addEventListener('focusout', this.handleFocusOut.bind(this));
  }

  startAddingSubtask() {
    console.log('Adding subtask');

    this.showInputBox();
  }

  startEditing() {
    console.log('Editing task');

    this.showInputBox();

    this.editing = true;
  }

  remove() {
    console.log('Removing task');

    let index = null;
    let taskArray = null;

    taskArray = Array.isArray(this.parentTask) ? this.parentTask : this.parentTask.subTasks;

    index = taskArray.indexOf(this.task);
    taskArray.splice(index, 1);

    this.element.remove();
    saveTasksToLocalStorage();
  }

  removeSubtasks() {
    console.log('Remove subtasks dummy');
  }

  toggleCollapse() {
    console.log('Toggle collapse');
    this.element.classList.toggle('collapsed');
    this.toggleCollapseIcon();
  }

  toggleCollapseIcon() {
    const icon = this.element.querySelector('.collapse').querySelector('i');
    if (icon.classList.contains('fa-caret-up')) {
      icon.classList.replace('fa-caret-up', 'fa-caret-down');
    }
    else if (icon.classList.contains('fa-caret-down')) {
      icon.classList.replace('fa-caret-down', 'fa-caret-up');
    }
  }

  showInputBox() {
    const input = this.element.querySelector('input');
    input.style.display = 'initial';
    input.focus();
  }

  hideInputBox() {
    const input = this.element.querySelector('input');
    input.style.display = 'none';
    input.value = '';
  }

  handleFocusOut(event) {
    if (event.target.nodeName === 'INPUT') {
      event.stopPropagation();

      this.hideInputBox();
    }
  }

  handleKeypress(event) {
    event.stopPropagation();
    
    if (event.code === 'Enter') {
      const inputElement = this.element.querySelector('input');

      if (inputElement.value.length === 0)
        return;
        
      if (this.editing) {
        this.task.name = inputElement.value;
        this.element.querySelector('div').querySelector('p').textContent = this.task.name;
        this.editing = false;
      } 

      else {
        const task = {
          name: inputElement.value
        };
      if (!this.task.subTasks) this.task.subTasks = [];

      this.task.subTasks.push(task);

      if (!this.element.querySelector('ul')) {
        this.element.appendChild(document.createElement('ul'));
      }

      const taskElement = createTaskHtml(task, this.task, '');
      const manager = new TaskManager(task, this.task, taskElement);
      this.element.querySelector('ul').appendChild(taskElement);
      }

      inputElement.value = '';
      inputElement.style.display = 'none';

      saveTasksToLocalStorage();
    }
  }
}

export default TaskManager;

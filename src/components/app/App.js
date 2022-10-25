import { Component } from 'react';
import './App.css';
import { formatDistanceToNow } from 'date-fns';

import TaskList from '../task-list';
import NewTaskForm from '../new-task-form';
import Footer from '../footer';

const getId = () => Math.floor(Math.random() * 10 ** 10);

export default class App extends Component {
  static createForTodoList(label) {
    const currentTime = new Date();
    return {
      done: false,
      editing: false,
      id: getId(),
      label,
      getTime: 'created 1 second ago',
      currentTime,
    };
  }

  static changeTodoData = (todoData, id, key) => todoData.map((el) => (el.id === id ? { ...el, [key]: !el[key] } : el));

  static filter(items, filter) {
    const match = {
      all() {
        return items;
      },
      active() {
        return items.filter((item) => !item.done);
      },
      completed() {
        return items.filter((item) => item.done);
      },
    };
    return match[filter] ? match[filter]() : items;
  }

  constructor(props) {
    super(props);

    this.state = {
      todoData: [],
      filter: 'all',
    };
    this.updateInterval = 2000;
  }

  componentDidMount() {
    this.setState({
      todoData: [
        App.createForTodoList('Completed task'),
        App.createForTodoList('Editing task'),
        App.createForTodoList('Active task'),
      ],
    });

    const tick = () => {
      this.tickTimer();
      this.timerId = setTimeout(tick, this.updateInterval);
    };
    this.timerId = setTimeout(tick, this.updateInterval);
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  tickTimer = () => {
    this.setState(({ todoData }) => ({
      todoData: todoData.map((task) => {
        const getTime = formatDistanceToNow(new Date(task.currentTime), { includeSeconds: true });

        return { ...task, getTime };
      }),
    }));
  };

  deleteTask = (id) => {
    this.setState(({ todoData }) => ({ todoData: todoData.filter((item) => item.id !== id) }));
  };

  onToggleEditing = (id) => {
    this.setState(({ todoData }) => ({
      todoData: App.changeTodoData(todoData, id, 'editing'),
    }));
  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => ({
      todoData: App.changeTodoData(todoData, id, 'done'),
    }));
  };

  onFormatLabel = (id, label) => {
    this.setState(({ todoData }) => ({
      todoData: todoData.map((el) => (el.id === id ? { ...el, label, editing: !el.editing } : el)),
    }));
  };

  addNewTask = (label) => {
    const newItem = App.createForTodoList(label);
    this.setState(({ todoData }) => ({ todoData: [newItem, ...todoData] }));
  };

  onFilterChange = (filter) => {
    this.setState(() => ({ filter }));
  };

  onClearCompleted = () => {
    this.setState(({ todoData }) => ({ todoData: todoData.filter((item) => !item.done) }));
  };

  render() {
    const { todoData, filter } = this.state;
    const visibleItems = App.filter(todoData, filter);
    const isCompletedTasksCount = `${todoData.filter((item) => !item.done).length}`;

    return (
      <section className="todoapp">
        <NewTaskForm addNewTask={this.addNewTask} />
        <section className="main">
          <TaskList
            todoData={visibleItems}
            onToggleDone={this.onToggleDone}
            onToggleEditing={this.onToggleEditing}
            onDeleted={this.deleteTask}
            onFormatLabel={this.onFormatLabel}
          />
          <Footer
            onFilterChange={this.onFilterChange}
            filter={filter}
            onClearCompleted={this.onClearCompleted}
            isCompletedTasksCount={isCompletedTasksCount}
          />
        </section>
      </section>
    );
  }
}

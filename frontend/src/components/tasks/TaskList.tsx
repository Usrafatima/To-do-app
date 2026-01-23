import { Task } from "@/lib/apiClient";
import TaskItem from "./TaskItem";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <p className="text-lg">No tasks found. Add a new one!</p>
      </div>
    );
  }

  return (
    <TransitionGroup className="space-y-4 mt-4">
      {tasks.map(task => (
        <CSSTransition
          key={task.id}
          timeout={500}
          classNames="task-item"
        >
          <TaskItem
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}

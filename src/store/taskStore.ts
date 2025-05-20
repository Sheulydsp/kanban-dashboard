// store/taskStore.ts
import { create } from 'zustand';
import type{ Task } from '../type';
import { arrayMove } from '@dnd-kit/sortable';

interface TaskState {
  tasks: Task[];
  loadTasks: () => void;
  addTask: (task: Task) => void;
  updateTask: (updated: Task) => void;
  reorderTasks: (column: Task['status'], activeId: string, overId: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],

  loadTasks: () => {
    const stored = localStorage.getItem('tasks');
    const parsed: Task[] = stored ? JSON.parse(stored) : [];
    set({ tasks: parsed });
  },

  addTask: (task) =>
    set((state) => {
      const updated = [...state.tasks, task];
      localStorage.setItem('tasks', JSON.stringify(updated));
      return { tasks: updated };
    }),

  updateTask: (updatedTask) =>
    set((state) => {
      const updated = state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      localStorage.setItem('tasks', JSON.stringify(updated));
      return { tasks: updated };
    }),

  reorderTasks: (column, activeId, overId) =>
    set((state) => {
      const columnTasks = state.tasks.filter((task) => task.status === column);
      const otherTasks = state.tasks.filter((task) => task.status !== column);

      const oldIndex = columnTasks.findIndex((task) => task.id === activeId);
      const newIndex = columnTasks.findIndex((task) => task.id === overId);

      if (oldIndex === -1 || newIndex === -1) return {};

      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      const updatedTasks = [...otherTasks, ...reordered];

      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { tasks: updatedTasks };
    }),
}));

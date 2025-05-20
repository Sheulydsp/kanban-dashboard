import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { v4 as uuidv4 } from 'uuid';
import EditTaskModal from '../components/EditTaskModal';
import type { Task } from '../type';
import type { DragEndEvent } from '@dnd-kit/core';
import BoardHeader from '../components/BoardHeader';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const columns = ['Backlog', 'In Progress', 'Review', 'Done'] as const;

const SortableTask = ({ task, onEdit }: { task: Task; onEdit: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,  // use this instead of hardcoding
    };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-3 rounded shadow mb-3 hover:bg-blue-50 transition relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab"
        title="Drag"
      >
        <GripVertical className="text-gray-400" />
      </div>
      <h4 className="font-medium">{task.title}</h4>
      {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
      {task.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>}
      {task.priority && (
        <p className={`text-xs mt-1 font-semibold ${
          task.priority === 'High' ? 'text-red-600' :
          task.priority === 'Medium' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          Priority: {task.priority}
        </p>
      )}
      {task.tags && task.tags.length > 0 && (
        <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-200 px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      )}
      <button
        onClick={onEdit}
        className="text-sm text-blue-600 hover:underline mt-2"
      >
        Edit
      </button>
    </div>
  );
};

const Board = () => {
  const { tasks, loadTasks, addTask, updateTask, reorderTasks } = useTaskStore();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'Backlog' | 'In Progress' | 'Review' | 'Done'>('Backlog');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    addTask({
      id: uuidv4(),
      title: title.trim(),
      status,
      description: description.trim(),
      dueDate: dueDate || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      priority,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setTags('');
    setPriority('Medium');
    setError('');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overTask = tasks.find((task) => task.id === over.id);
    if (!activeTask || !overTask) return;

    if (activeTask.status === overTask.status) {
      reorderTasks(activeTask.status, active.id as string, over.id as string);
    } else {
      updateTask({ ...activeTask, status: overTask.status });
    }
  };

  const handleSave = (updatedTask: Task) => {
    updateTask(updatedTask);
    setEditingTask(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
    <BoardHeader tasks={tasks} />

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Add Task Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4 col-span-1"
      >
        <h2 className="text-xl font-bold">Add Task</h2>
        {error && <div className="text-red-600 font-semibold">{error}</div>}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full border rounded px-3 py-2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full border rounded px-3 py-2"
        >
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          className="w-full border rounded px-3 py-2"
          rows={3}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          className="w-full border rounded px-3 py-2"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>

      {/* Kanban Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveTaskId(active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {columns.map((col) => {
            const columnTasks = tasks.filter((task) => task.status === col);
            return (
              <div key={col} className="bg-gray-50 rounded p-4 shadow">
                <h3 className="font-semibold mb-4 text-lg">{col}</h3>
                <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  {columnTasks.map((task) => (
                    <SortableTask key={task.id} task={task} onEdit={() => setEditingTask(task)} />
                  ))}
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTaskId && (
            <div className="bg-white p-3 rounded shadow border w-full max-w-xs">
              <h4 className="font-medium">
                {tasks.find((t) => t.id === activeTaskId)?.title || 'Dragging...'}
              </h4>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {editingTask && (
        <EditTaskModal
          selectedTask={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSave}
        />
      )}
    </div>
    </div>
  
  );
  
};

export default Board;

import React, { useState, useEffect } from 'react';
import type { Task } from '../type';

interface EditTaskModalProps {
  selectedTask: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const EditTaskModal = ({ selectedTask, onClose, onSave }: EditTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Task['status']>('Backlog');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(selectedTask.title);
    setStatus(selectedTask.status);
    setDescription(selectedTask.description || '');
    setDueDate(selectedTask.dueDate || '');
    setTags(selectedTask.tags?.join(', ') || '');
    setPriority(selectedTask.priority || 'Medium');
  }, [selectedTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    onSave({
      ...selectedTask,
      title: title.trim(),
      status,
      description: description.trim(),
      dueDate,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      priority,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />

          <textarea
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
          >
            <option value="Backlog">Backlog</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>

          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Due Date"
           />

            <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            />

            <select
            className="w-full border px-3 py-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
            >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            </select>

    

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;

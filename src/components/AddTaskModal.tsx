import { useState } from 'react';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useTaskStore } from '../store/taskStore';

const schema = Yup.object().shape({
  title: Yup.string().required('Task title is required.'),
  status: Yup.string().oneOf(['Backlog', 'In Progress', 'Review', 'Done']).required(),
  description: Yup.string(),
  dueDate: Yup.date().nullable(),
  priority: Yup.string().oneOf(['Low', 'Medium', 'High']),
  tags: Yup.string(),
});

const AddTaskModal = () => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'Backlog' | 'In Progress' | 'Review' | 'Done'>('Backlog');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [error, setError] = useState('');

  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await schema.validate({ title, status, description, dueDate, tags, priority });
      setError('');

      addTask({
        id: uuidv4(),
        title,
        status,
        description,
        dueDate,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        priority,
      });

      // Clear form
      setTitle('');
      setDescription('');
      setDueDate('');
      setTags('');
      setPriority('Medium');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Task</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="w-full border rounded px-3 py-2 mb-4"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="w-full border rounded px-3 py-2 mb-4"
      >
        <option value="Backlog">Backlog</option>
        <option value="In Progress">In Progress</option>
        <option value="Review">Review</option>
        <option value="Done">Done</option>
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description (optional)"
        className="w-full border rounded px-3 py-2 mb-4"
        rows={4}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full border rounded px-3 py-2 mb-4"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as any)}
        className="w-full border rounded px-3 py-2 mb-4"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskModal;

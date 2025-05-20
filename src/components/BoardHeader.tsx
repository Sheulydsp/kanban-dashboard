
import type { Task } from '../type';

interface BoardHeaderProps {
  tasks: Task[];
}

const BoardHeader = ({ tasks }: BoardHeaderProps) => {
  const counts = {
    Backlog: tasks.filter(t => t.status === 'Backlog').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Review: tasks.filter(t => t.status === 'Review').length,
    Done: tasks.filter(t => t.status === 'Done').length,
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="mb-6 text-center">
     <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-md mb-6 tracking-tight">
        Kanban Dashboard
     </h1>

      <p className="text-gray-600 mt-2">
        Backlog: {counts.Backlog} | In Progress: {counts['In Progress']} | Review: {counts.Review} | Done: {counts.Done}
      </p>
      <p className="text-gray-500 text-sm mt-1">Updated on {today}</p>
    </div>
  );
};

export default BoardHeader;

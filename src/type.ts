export interface Task {
  id: string;
  title: string;
  status: 'Backlog' | 'In Progress' | 'Review' | 'Done';
  description?: string;
  dueDate?: string;
  tags?: string[];
  priority?: 'Low' | 'Medium' | 'High';
}

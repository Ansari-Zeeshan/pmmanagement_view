import React from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { ProjectDetailsDrawer } from '../projects/drawers/ProjectDetailsDrawer';

export const ChatDrawer = () => {
  const { isChatDrawerOpen, setChatDrawerOpen, activeChatTask, activeTaskDetail, updateTask } = useWorkspaceStore();

  if (!isChatDrawerOpen) return null;

  const currentTask = activeChatTask || activeTaskDetail || {
    title: 'Facade & Exterior Design Specs',
    description: 'Thermal glass insulation specs, aluminum panel cladding, and wind tunnel aerodynamic simulation.',
    group: 'Research',
    createdDate: 'Oct 20, 2021, 10:00 AM',
    startDate: 'Oct 20, 2021',
    endDate: 'Oct 28, 2021',
    estimatedHours: '40',
    status: 'At Risk',
    actualBudget: '180000 AED',
  };

  return (
    <ProjectDetailsDrawer
      task={currentTask}
      defaultTab="UPDATES"
      onClose={() => setChatDrawerOpen(false)}
      onSave={(updatedTask) => updateTask(updatedTask)}
    />
  );
};

export default ChatDrawer;

import { useState } from "react";
import { usePlanner } from "../hooks/usePlanner";
import Sidebar from "./Sidebar";
import Board from "./Board";
import TaskDetail from "./TaskDetail";

export default function Planner() {
  const planner = usePlanner();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getSelected = () => {
    if (!selectedTask) return null;
    const bucket = planner.activePlan?.buckets.find(b => b.id === selectedTask.bucketId);
    const task = bucket?.tasks.find(t => t.id === selectedTask.taskId);
    return task ? { task, bucket } : null;
  };

  const sel = getSelected();
  const totalTasks = planner.activePlan?.buckets.reduce((s, b) => s + b.tasks.length, 0) || 0;

  return (
    <div className="app-layout">
      
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999 }} 
        />
      )}

      <Sidebar 
        plans={planner.state.plans} 
        activePlanId={planner.state.activePlanId} 
        setActivePlanId={planner.setActivePlanId}
        createPlan={planner.createPlan}
        updatePlanName={planner.updatePlanName}
        deletePlan={planner.deletePlan}
        setSelectedTask={setSelectedTask}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <div style={{ padding: '12px 20px', borderBottom: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          <button className="mobile-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
            <i className="ti ti-menu-2" style={{ fontSize: '20px' }} />
          </button>

          <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)', flex: 1 }}>{planner.activePlan?.name}</h1>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', background: 'var(--color-background-secondary)', padding: '2px 9px', borderRadius: '20px', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', flexShrink: 0 }}>
            {totalTasks} {totalTasks === 1 ? 'tarefa' : 'tarefas'}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', background: 'var(--color-background-secondary)', padding: '2px 9px', borderRadius: '20px', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', flexShrink: 0 }}>
            {planner.activePlan?.buckets.length || 0} buckets
          </span>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Board 
            activePlan={planner.activePlan}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            toggleTask={planner.toggleTask}
            deleteBucket={planner.deleteBucket}
            createTask={planner.createTask}
            createBucket={planner.createBucket}
            updateBucketName={planner.updateBucketName}
            moveTask={planner.moveTask}
            toggleSubtask={planner.toggleSubtask} /* <--- PONTE 1: ADICIONADO */
          />

          {sel && (
            <TaskDetail 
              sel={sel}
              setSelectedTask={setSelectedTask}
              toggleTask={planner.toggleTask}
              updateTaskField={planner.updateTaskField}
              toggleSubtask={planner.toggleSubtask}
              addSubtask={planner.addSubtask}
              deleteTask={planner.deleteTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}
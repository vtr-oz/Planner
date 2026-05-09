import { useState } from 'react';
import TaskCard from './TaskCard';

export default function Bucket({ bucket, selectedTask, setSelectedTask, toggleTask, deleteBucket, createTask, updateBucketName, moveTask }) {
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const doneTasks = bucket.tasks.filter(t => t.done).length;

  const handleCreateTask = () => {
    createTask(bucket.id, newTaskTitle);
    setNewTaskTitle('');
    setAddingTask(false);
  };

  return (
    <div 
      style={{ width: '268px', flexShrink: 0, display: 'flex', flexDirection: 'column', maxHeight: '100%' }}
      // --- INÍCIO DA ADIÇÃO DO DRAG AND DROP ---
      onDragOver={(e) => e.preventDefault()} // Impede o comportamento padrão para permitir soltar o item aqui
      onDrop={(e) => {
        const taskId = e.dataTransfer.getData('taskId');
        const sourceBucketId = e.dataTransfer.getData('sourceBucketId');
        
        // Verifica se a tarefa veio de OUTRO bucket para não re-renderizar à toa
        if (sourceBucketId !== String(bucket.id)) {
          moveTask(sourceBucketId, bucket.id, taskId);
        }
      }}
      // --- FIM DA ADIÇÃO DO DRAG AND DROP ---
    >
      
      {/* Bucket header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px', padding: '0 2px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: bucket.color, flexShrink: 0 }} />
        
        {/* Bloco de renomear */}
        {isEditingName ? (
          <input
            autoFocus
            defaultValue={bucket.name}
            onBlur={e => { updateBucketName(bucket.id, e.target.value); setIsEditingName(false); }}
            onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
            style={{ flex: 1, fontSize: '13px', fontWeight: 500, padding: '2px 4px', border: '1px solid var(--color-border-info)', borderRadius: '4px' }}
          />
        ) : (
          <span 
            onDoubleClick={() => setIsEditingName(true)} 
            title="Dê um duplo clique para renomear"
            style={{ fontWeight: 500, fontSize: '13px', color: 'var(--color-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'text' }}
          >
            {bucket.name}
          </span>
        )}

        <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', minWidth: '20px', textAlign: 'center' }}>{bucket.tasks.length}</span>
        <button onClick={() => deleteBucket(bucket.id)} title="Remover bucket" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '2px', borderRadius: 'var(--border-radius-md)', display: 'flex', lineHeight: 1 }}>
          <i className="ti ti-trash" style={{ fontSize: '14px' }} aria-hidden="true" />
        </button>
      </div>

      {/* Progress */}
      {bucket.tasks.length > 0 && (
        <div style={{ height: '2px', background: 'var(--color-background-secondary)', borderRadius: '2px', marginBottom: '10px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.round((doneTasks / bucket.tasks.length) * 100)}%`, background: bucket.color, borderRadius: '2px', transition: 'width 0.4s' }} />
        </div>
      )}

      {/* Task cards */}
      <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {bucket.tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            bucket={bucket} 
            selectedTask={selectedTask} 
            setSelectedTask={setSelectedTask} 
            toggleTask={toggleTask} 
          />
        ))}

        {/* Add task */}
        {addingTask ? (
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', padding: '10px 11px' }}>
            <input autoFocus value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateTask(); if (e.key === 'Escape') { setAddingTask(false); setNewTaskTitle(''); } }}
              placeholder="Nome da tarefa..." style={{ width: '100%', fontSize: '13px', border: 'none', outline: 'none', background: 'transparent', color: 'var(--color-text-primary)', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
              <button onClick={handleCreateTask} style={{ flex: 1, padding: '5px', fontSize: '12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-info)', background: 'var(--color-background-info)', color: 'var(--color-text-info)', cursor: 'pointer', fontWeight: 500 }}>Adicionar</button>
              <button onClick={() => { setAddingTask(false); setNewTaskTitle(''); }} style={{ padding: '5px 8px', fontSize: '12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingTask(true)} style={{ width: '100%', padding: '7px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', background: 'transparent', color: 'var(--color-text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '12px' }}>
            <i className="ti ti-plus" style={{ fontSize: '14px' }} aria-hidden="true" /> Adicionar tarefa
          </button>
        )}
      </div>
    </div>
  );
}
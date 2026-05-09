import { useState } from 'react';
import Bucket from './Bucket';

export default function Board({ 
  activePlan, 
  selectedTask, 
  setSelectedTask, 
  toggleTask, 
  deleteBucket, 
  createTask, 
  createBucket, 
  updateBucketName,
  moveTask,
  toggleSubtask /* <--- RECEBEU DO PLANNER */
}) {
  const [addingBucket, setAddingBucket] = useState(false);
  const [newBucketName, setNewBucketName] = useState('');

  const handleCreateBucket = () => {
    createBucket(newBucketName);
    setNewBucketName('');
    setAddingBucket(false);
  };

  return (
    <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      
      {activePlan?.buckets.map(bucket => (
        <Bucket 
          key={bucket.id} 
          bucket={bucket} 
          selectedTask={selectedTask} 
          setSelectedTask={setSelectedTask} 
          toggleTask={toggleTask} 
          deleteBucket={deleteBucket}
          createTask={createTask}
          updateBucketName={updateBucketName}
          moveTask={moveTask}
          toggleSubtask={toggleSubtask} /* <--- PONTE 2: REPASSOU PRO BUCKET */
        />
      ))}

      {/* Add bucket */}
      <div style={{ width: '268px', flexShrink: 0 }}>
        {addingBucket ? (
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', padding: '12px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Novo bucket</p>
            <input autoFocus value={newBucketName} onChange={e => setNewBucketName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateBucket(); if (e.key === 'Escape') { setAddingBucket(false); setNewBucketName(''); } }}
              placeholder="Nome do bucket..." style={{ width: '100%', fontSize: '13px', padding: '6px 8px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <button onClick={handleCreateBucket} style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-info)', background: 'var(--color-background-info)', color: 'var(--color-text-info)', cursor: 'pointer', fontWeight: 500 }}>Criar bucket</button>
              <button onClick={() => { setAddingBucket(false); setNewBucketName(''); }} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingBucket(true)} style={{ width: '100%', padding: '11px', borderRadius: 'var(--border-radius-md)', border: '0.5px dashed var(--color-border-secondary)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontSize: '13px', fontWeight: 500 }}>
            <i className="ti ti-plus" style={{ fontSize: '16px' }} aria-hidden="true" /> Novo bucket
          </button>
        )}
      </div>
    </div>
  );
}
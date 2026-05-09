import { PRIORITY } from '../data/initialData';

export default function TaskCard({ task, bucket, selectedTask, setSelectedTask, toggleTask }) {
  if (!task) return null;

  const safeSubtasks = task.subtasks || [];
  const doneSub = safeSubtasks.filter(s => s.done).length;
  const isSelected = selectedTask?.taskId === task.id;
  const pInfo = PRIORITY[task.priority];

  return (
    <div
      // --- INÍCIO DAS ADIÇÕES DO DRAG AND DROP ---
      draggable 
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.setData('sourceBucketId', bucket.id);
      }}
      // --- FIM DAS ADIÇÕES ---
      
      onClick={() => setSelectedTask(isSelected ? null : { bucketId: bucket.id, taskId: task.id })}
      style={{
        background: 'var(--color-background-primary)',
        border: isSelected ? `1.5px solid ${bucket.color}` : '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
        padding: '10px 11px',
        cursor: 'grab', /* Mudamos de 'pointer' para 'grab' (mãozinha de pegar) */
        borderLeft: `3px solid ${bucket.color}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div
          onClick={e => toggleTask(bucket.id, task.id, e)}
          style={{ width: '15px', height: '15px', borderRadius: '50%', border: `1.5px solid ${task.done ? bucket.color : 'var(--color-border-secondary)'}`, background: task.done ? bucket.color : 'transparent', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}
        >
          {task.done && <i className="ti ti-check" style={{ fontSize: '9px', color: 'white' }} aria-hidden="true" />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '13px', color: task.done ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', textDecoration: task.done ? 'line-through' : 'none', fontWeight: 500, lineHeight: 1.35, wordBreak: 'break-word' }}>
            {task.title}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '5px', flexWrap: 'wrap' }}>
            {pInfo && (
              <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '20px', background: pInfo.color + '22', color: pInfo.color, fontWeight: 500 }}>
                {pInfo.label}
              </span>
            )}
            {safeSubtasks.length > 0 && (
              <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <i className="ti ti-checks" style={{ fontSize: '12px' }} aria-hidden="true" /> {doneSub}/{safeSubtasks.length}
              </span>
            )}
            {task.notes && <i className="ti ti-notes" style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }} aria-hidden="true" />}
          </div>

          {safeSubtasks.length > 0 && (
            <div style={{ marginTop: '7px', height: '2px', background: 'var(--color-background-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.round((doneSub / safeSubtasks.length) * 100)}%`, background: bucket.color, borderRadius: '2px', transition: 'width 0.3s' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { PRIORITY } from '../data/initialData';

export default function TaskCard({ task, bucket, selectedTask, setSelectedTask, toggleTask, toggleSubtask /* <--- RECEBEU DO BUCKET */ }) {
  if (!task) return null;

  const safeSubtasks = task.subtasks || [];
  const doneSub = safeSubtasks.filter(s => s.done).length;
  const isSelected = selectedTask?.taskId === task.id;
  const pInfo = PRIORITY[task.priority];

  // Formata a data para um formato curto e bonito (ex: "12 mai")
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) 
    : null;

  return (
    <div
      draggable 
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.setData('sourceBucketId', bucket.id);
      }}
      onClick={() => setSelectedTask(isSelected ? null : { bucketId: bucket.id, taskId: task.id })}
      style={{
        background: 'var(--color-background-primary)',
        border: isSelected ? `1.5px solid ${bucket.color}` : '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
        padding: '10px 11px',
        cursor: 'grab',
        borderLeft: `3px solid ${bucket.color}`,
        display: 'flex', /* Mudado para flex para organizar subtasks embaixo */
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {/* --- Main Content (CheckBox + Title + Tags) --- */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        
        {/* Checkbox da Tarefa Principal */}
        <div
          onClick={e => toggleTask(bucket.id, task.id, e)}
          style={{ width: '15px', height: '15px', borderRadius: '50%', border: `1.5px solid ${task.done ? bucket.color : 'var(--color-border-secondary)'}`, background: task.done ? bucket.color : 'transparent', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}
        >
          {task.done && <i className="ti ti-check" style={{ fontSize: '9px', color: 'white' }} aria-hidden="true" />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Título */}
          <p style={{ margin: 0, fontSize: '13px', color: task.done ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', textDecoration: task.done ? 'line-through' : 'none', fontWeight: 500, lineHeight: 1.35, wordBreak: 'break-word' }}>
            {task.title}
          </p>

          {/* Área de Etiquetas (Prioridade, Data, Contagem Subtarefas) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
            
            {/* Etiqueta de Prioridade */}
            {pInfo && (
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: pInfo.color + '22', color: pInfo.color, fontWeight: 500 }}>
                {pInfo.label}
              </span>
            )}

            {/* Etiqueta de Data */}
            {formattedDate && (
              <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--color-background-secondary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>
                <i className="ti ti-calendar" style={{ fontSize: '12px' }} aria-hidden="true" />
                {formattedDate}
              </span>
            )}

            {/* Etiqueta de Contagem */}
            {safeSubtasks.length > 0 && (
              <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--color-background-secondary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>
                <i className="ti ti-checks" style={{ fontSize: '12px' }} aria-hidden="true" /> 
                {doneSub}/{safeSubtasks.length}
              </span>
            )}

            {/* Ícone de Notas */}
            {task.notes && (
              <i className="ti ti-notes" style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginLeft: '2px' }} title="Possui notas" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      {/* --- INÍCIO DA ADIÇÃO DAS SUBTAREFAS INTERATIVAS (NOVO) --- */}
      {safeSubtasks.length > 0 && (
        <div style={{ paddingLeft: '23px', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px', borderTop: '0.5px solid var(--color-border-tertiary)', paddingTop: '8px' }}>
          {safeSubtasks.map(sub => (
            <div 
              key={sub.id} 
              style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
              // Evita que clicar na subtarefa selecione o cartão principal
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Checkbox da Subtarefa */}
              <div 
                onClick={(e) => toggleSubtask(bucket.id, task.id, sub.id, e)}
                style={{ width: '13px', height: '13px', borderRadius: '3px', border: `1.5px solid ${sub.done ? bucket.color : 'var(--color-border-secondary)'}`, background: sub.done ? bucket.color : 'transparent', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {sub.done && <i className="ti ti-check" style={{ fontSize: '8px', color: 'white' }} aria-hidden="true" />}
              </div>
              
              {/* Título da Subtarefa */}
              <span style={{ fontSize: '12px', flex: 1, color: sub.done ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', textDecoration: sub.done ? 'line-through' : 'none', lineHeight: 1.3 }}>
                {sub.title}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* --- FIM DA ADIÇÃO --- */}
    </div>
  );
}
import { useState } from 'react';
import { PRIORITY } from '../data/initialData';

export default function TaskDetail({ sel, setSelectedTask, toggleTask, updateTaskField, toggleSubtask, addSubtask, deleteTask, deleteSubtask, editSubtask }) {
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = () => {
    addSubtask(sel.bucket.id, sel.task.id, newSubtask);
    setNewSubtask('');
  };

  return (
    <div className="task-detail-panel">
      
      {/* Panel header com Título Editável */}
      <div style={{ padding: '12px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sel.bucket.color }} />
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{sel.bucket.name}</span>
          </div>
          <input 
            value={sel.task.title} 
            onChange={e => updateTaskField(sel.bucket.id, sel.task.id, 'title', e.target.value)}
            style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', width: '100%', border: 'none', background: 'transparent', outline: 'none' }} 
          />
        </div>
        <button onClick={() => setSelectedTask(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '2px', display: 'flex', flexShrink: 0 }}>
          <i className="ti ti-x" style={{ fontSize: '17px' }} aria-hidden="true" />
        </button>
      </div>

      {/* Status toggle */}
      <div style={{ padding: '12px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <button onClick={() => toggleTask(sel.bucket.id, sel.task.id)}
          style={{ width: '100%', padding: '7px', borderRadius: 'var(--border-radius-md)', border: `1.5px solid ${sel.task.done ? sel.bucket.color : 'var(--color-border-secondary)'}`, background: sel.task.done ? sel.bucket.color + '18' : 'transparent', color: sel.task.done ? sel.bucket.color : 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
          <i className={`ti ti-${sel.task.done ? 'circle-check-filled' : 'circle'}`} style={{ fontSize: '16px' }} aria-hidden="true" />
          {sel.task.done ? 'Concluída' : 'Marcar como concluída'}
        </button>
      </div>

      {/* DATA DE CONCLUSÃO (NOVO) */}
      <div style={{ padding: '12px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <p style={{ margin: '0 0 7px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data de Conclusão</p>
        <input 
          type="date" 
          value={sel.task.dueDate || ''} 
          onChange={e => updateTaskField(sel.bucket.id, sel.task.id, 'dueDate', e.target.value)}
          style={{ width: '100%', fontSize: '12px', padding: '6px 8px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }} 
        />
      </div>

      {/* Priority */}
      <div style={{ padding: '12px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <p style={{ margin: '0 0 7px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prioridade</p>
        <div style={{ display: 'flex', gap: '5px' }}>
          {Object.entries(PRIORITY).map(([key, { label, color }]) => (
            <button key={key} onClick={() => updateTaskField(sel.bucket.id, sel.task.id, 'priority', key)}
              style={{ flex: 1, padding: '5px 4px', fontSize: '11px', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', fontWeight: 500, border: `1.5px solid ${sel.task.priority === key ? color : 'var(--color-border-tertiary)'}`, background: sel.task.priority === key ? color + '22' : 'transparent', color: sel.task.priority === key ? color : 'var(--color-text-tertiary)' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Status</label>
        <select 
          value={sel.task.status || 'Não iniciado'} 
          onChange={(e) => updateTaskField(sel.bucket.id, sel.task.id, 'status', e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
        >
          <option value="Não iniciado">Não iniciado</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Aguardando">Aguardando</option>
          <option value="Concluída">Concluída</option>
        </select>
      </div>

      {/* Notes */}
      <div style={{ padding: '12px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <p style={{ margin: '0 0 7px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notas</p>
        <textarea value={sel.task.notes} onChange={e => updateTaskField(sel.bucket.id, sel.task.id, 'notes', e.target.value)}
          placeholder="Adicione descrição ou notas..." style={{ width: '100%', minHeight: '72px', fontSize: '12px', padding: '7px 8px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', lineHeight: 1.5 }} />
      </div>

      {/* Subtasks */}
        <div style={{ padding: '12px 14px', flex: 1 }}>
          <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Subtarefas
            {sel.task.subtasks?.length > 0 && (
              <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', background: 'var(--color-background-secondary)', padding: '1px 6px', borderRadius: '20px', border: '0.5px solid var(--color-border-tertiary)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                {sel.task.subtasks.filter(s => s.done).length}/{sel.task.subtasks.length}
              </span>
            )}
          </p>

          {/* --- INÍCIO DO PASSO C: A LISTA ATUALIZADA --- */}
          {sel.task.subtasks?.map(sub => (
            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', background: 'var(--color-background-secondary)', padding: '6px 10px', borderRadius: '4px' }}>
              
              <input 
                type="checkbox" 
                checked={sub.done} 
                onChange={(e) => toggleSubtask(sel.bucket.id, sel.task.id, sub.id, e)} 
              />
              
              <span style={{ flex: 1, fontSize: '14px', textDecoration: sub.done ? 'line-through' : 'none', color: sub.done ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}>
                {sub.title}
              </span>
              
              {/* Botão de Editar */}
              <button 
                onClick={() => {
                  const novoTitulo = window.prompt("Editar subtarefa:", sub.title);
                  if (novoTitulo) editSubtask(sel.bucket.id, sel.task.id, sub.id, novoTitulo);
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '4px' }}
                title="Editar subtarefa"
              >
                <i className="ti ti-pencil" />
              </button>

              {/* Botão de Excluir */}
              <button 
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja excluir esta subtarefa?")) {
                    deleteSubtask(sel.bucket.id, sel.task.id, sub.id);
                  }
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', padding: '4px' }}
                title="Excluir subtarefa"
              >
                <i className="ti ti-trash" />
              </button>
            </div>
          ))}
          {/* --- FIM DO PASSO C --- */}

          <input 
            type="text" 
            placeholder="+ Adicionar subtarefa e pressionar Enter" 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                addSubtask(sel.bucket.id, sel.task.id, e.target.value);
                e.target.value = '';
              }
            }}
            style={{ width: '100%', padding: '8px', border: '1px dashed var(--color-border-secondary)', background: 'transparent', color: 'var(--color-text-primary)', fontSize: '13px', borderRadius: '4px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
          {sel.task.subtasks.map(sub => (
            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)' }}>
              <div onClick={() => toggleSubtask(sel.bucket.id, sel.task.id, sub.id)}
                style={{ width: '13px', height: '13px', borderRadius: '3px', border: `1.5px solid ${sub.done ? sel.bucket.color : 'var(--color-border-secondary)'}`, background: sub.done ? sel.bucket.color : 'transparent', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {sub.done && <i className="ti ti-check" style={{ fontSize: '8px', color: 'white' }} aria-hidden="true" />}
              </div>
              <span style={{ fontSize: '12px', flex: 1, color: sub.done ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', textDecoration: sub.done ? 'line-through' : 'none', lineHeight: 1.35 }}>{sub.title}</span>
            </div>
          ))}
        </div>

        {/* Add subtask */}
        <div style={{ display: 'flex', gap: '5px' }}>
          <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddSubtask(); }}
            placeholder="Nova subtarefa... (Enter para adicionar)" style={{ flex: 1, fontSize: '12px', padding: '6px 8px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }} />
          <button onClick={handleAddSubtask}
            style={{ padding: '6px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-info)', background: 'var(--color-background-info)', color: 'var(--color-text-info)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <i className="ti ti-plus" style={{ fontSize: '14px' }} aria-hidden="true" />
          </button>
        </div>

      {/* Delete */}
      <div style={{ padding: '10px 14px', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
        <button onClick={() => { deleteTask(sel.bucket.id, sel.task.id); setSelectedTask(null); }}
          style={{ width: '100%', padding: '7px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-danger)', background: 'transparent', color: 'var(--color-text-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}>
          <i className="ti ti-trash" style={{ fontSize: '14px' }} aria-hidden="true" /> Excluir tarefa
        </button>
      </div>
    </div>
  );
}
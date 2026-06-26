import { useState } from 'react';
import { PRIORITY } from '../data/initialData';

export default function TaskDetail({ sel, setSelectedTask, toggleTask, updateTaskField, toggleSubtask, addSubtask, deleteTask, deleteSubtask, editSubtask }) {
  const [newSubtask, setNewSubtask] = useState('');
  
  // Estados para controlar a edição inline
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      addSubtask(sel.bucket.id, sel.task.id, newSubtask);
      setNewSubtask('');
    }
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

      {/* Status Select */}
      <div style={{ padding: '12px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <p style={{ margin: '0 0 7px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</p>
        <select 
          value={sel.task.status || 'Não iniciado'} 
          onChange={(e) => updateTaskField(sel.bucket.id, sel.task.id, 'status', e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', outline: 'none' }}
        >
          <option value="Não iniciado">Não iniciado</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Aguardando">Aguardando</option>
          <option value="Concluída">Concluída</option>
        </select>
      </div>

      {/* DATA DE CONCLUSÃO */}
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

      {/* Notes */}
      <div style={{ padding: '12px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <p style={{ margin: '0 0 7px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notas</p>
        <textarea value={sel.task.notes || ''} onChange={e => updateTaskField(sel.bucket.id, sel.task.id, 'notes', e.target.value)}
          placeholder="Adicione descrição ou notas..." style={{ width: '100%', minHeight: '72px', fontSize: '12px', padding: '7px 8px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', lineHeight: 1.5, outline: 'none' }} />
      </div>

      {/* Subtasks (Lista Unificada) */}
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Subtarefas
          {sel.task.subtasks?.length > 0 && (
            <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', background: 'var(--color-background-secondary)', padding: '1px 6px', borderRadius: '20px', border: '0.5px solid var(--color-border-tertiary)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              {sel.task.subtasks.filter(s => s.done).length}/{sel.task.subtasks.length}
            </span>
          )}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
          {sel.task.subtasks?.map(sub => (
            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)' }}>
              
              {/* Checkbox customizado */}
              <div onClick={(e) => { e.stopPropagation(); toggleSubtask(sel.bucket.id, sel.task.id, sub.id); }}
                style={{ width: '13px', height: '13px', borderRadius: '3px', border: `1.5px solid ${sub.done ? sel.bucket.color : 'var(--color-border-secondary)'}`, background: sub.done ? sel.bucket.color : 'transparent', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {sub.done && <i className="ti ti-check" style={{ fontSize: '8px', color: 'white' }} aria-hidden="true" />}
              </div>

              {/* Lógica de Edição Inline */}
              {editingSubtaskId === sub.id ? (
                <input 
                  type="text"
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => {
                    if (editTitle.trim() !== "") editSubtask(sel.bucket.id, sel.task.id, sub.id, editTitle);
                    setEditingSubtaskId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (editTitle.trim() !== "") editSubtask(sel.bucket.id, sel.task.id, sub.id, editTitle);
                      setEditingSubtaskId(null);
                    } else if (e.key === 'Escape') {
                      setEditingSubtaskId(null);
                    }
                  }}
                  style={{ flex: 1, fontSize: '12px', padding: '2px 4px', borderRadius: '3px', border: '1px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none' }}
                />
              ) : (
                <span 
                  onDoubleClick={() => {
                    setEditingSubtaskId(sub.id);
                    setEditTitle(sub.title);
                  }}
                  style={{ fontSize: '12px', flex: 1, color: sub.done ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', textDecoration: sub.done ? 'line-through' : 'none', lineHeight: 1.35, cursor: 'text' }}
                >
                  {sub.title}
                </span>
              )}

              {/* Botões de Ação (Apenas visíveis se não estiver editando) */}
              {editingSubtaskId !== sub.id && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => {
                      setEditingSubtaskId(sub.id);
                      setEditTitle(sub.title);
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '2px', display: 'flex' }}
                    title="Editar subtarefa"
                  >
                    <i className="ti ti-pencil" style={{ fontSize: '12px' }}/>
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm("Tem certeza que deseja excluir esta subtarefa?")) {
                        deleteSubtask(sel.bucket.id, sel.task.id, sub.id);
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-danger)', padding: '2px', display: 'flex' }}
                    title="Excluir subtarefa"
                  >
                    <i className="ti ti-trash" style={{ fontSize: '12px' }}/>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input para adicionar nova subtarefa */}
        <div style={{ display: 'flex', gap: '5px' }}>
          <input 
            value={newSubtask} 
            onChange={e => setNewSubtask(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddSubtask(); }}
            placeholder="Nova subtarefa... (Enter para adicionar)" 
            style={{ flex: 1, fontSize: '12px', padding: '6px 8px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', outline: 'none' }} 
          />
          <button 
            onClick={handleAddSubtask}
            style={{ padding: '6px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-info)', background: 'var(--color-background-info)', color: 'var(--color-text-info)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <i className="ti ti-plus" style={{ fontSize: '14px' }} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Delete Task */}
      <div style={{ padding: '10px 14px', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
        <button onClick={() => { deleteTask(sel.bucket.id, sel.task.id); setSelectedTask(null); }}
          style={{ width: '100%', padding: '7px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-danger)', background: 'transparent', color: 'var(--color-text-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}>
          <i className="ti ti-trash" style={{ fontSize: '14px' }} aria-hidden="true" /> Excluir tarefa
        </button>
      </div>
    </div>
  );
}
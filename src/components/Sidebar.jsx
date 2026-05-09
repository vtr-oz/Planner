import { useState } from 'react';

export default function Sidebar({ plans, activePlanId, setActivePlanId, createPlan, updatePlanName, deletePlan, setSelectedTask, isOpen, setIsOpen }) {
  const [addingPlan, setAddingPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [editingPlanId, setEditingPlanId] = useState(null);

  const handleCreatePlan = () => {
    createPlan(newPlanName);
    setNewPlanName('');
    setAddingPlan(false);
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div style={{ padding: '14px 16px 10px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ti ti-layout-kanban" style={{ fontSize: '18px', color: 'var(--color-text-info)' }} aria-hidden="true" />
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Task Planner</span>
        </div>
        {/* Botão de fechar (só aparece no celular via CSS) */}
        <button className="mobile-toggle-btn" onClick={() => setIsOpen(false)}>
          <i className="ti ti-x" style={{ fontSize: '18px' }} />
        </button>
      </div>

      <div style={{ padding: '8px', flex: 1, overflowY: 'auto' }}>
        <p style={{ margin: '6px 8px 4px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Meus planos</p>

        {plans.map(plan => {
          const isActive = plan.id === activePlanId;
          const isEditing = editingPlanId === plan.id;

          return (
            <div 
              key={plan.id}
              onClick={() => { setActivePlanId(plan.id); setSelectedTask(null); setIsOpen(false); /* Fecha a gaveta no celular */ }}
              style={{ padding: '7px 10px', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '7px', background: isActive ? 'var(--color-background-primary)' : 'transparent', border: isActive ? '0.5px solid var(--color-border-secondary)' : '0.5px solid transparent' }}
            >
              <i className="ti ti-file-description" style={{ fontSize: '15px', color: isActive ? 'var(--color-text-info)' : 'var(--color-text-tertiary)', flexShrink: 0 }} />
              
              {isEditing ? (
                <input
                  autoFocus
                  defaultValue={plan.name}
                  onBlur={(e) => { updatePlanName(plan.id, e.target.value); setEditingPlanId(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                  style={{ flex: 1, fontSize: '13px', border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
                />
              ) : (
                <>
                  <span onDoubleClick={(e) => { e.stopPropagation(); setEditingPlanId(plan.id); }} style={{ fontSize: '13px', color: 'var(--color-text-primary)', fontWeight: isActive ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {plan.name}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); if(confirm('Excluir este plano?')) deletePlan(plan.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '2px', display: 'flex', opacity: isActive ? 1 : 0 }}>
                    <i className="ti ti-trash" style={{ fontSize: '12px' }} />
                  </button>
                </>
              )}
            </div>
          );
        })}

        {addingPlan ? (
          <div style={{ padding: '6px 4px' }}>
            <input autoFocus value={newPlanName} onChange={e => setNewPlanName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreatePlan(); if (e.key === 'Escape') setAddingPlan(false); }} placeholder="Nome do plano..." style={{ width: '100%', fontSize: '12px', padding: '5px 8px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '4px', marginTop: '5px' }}>
              <button onClick={handleCreatePlan} style={{ flex: 1, padding: '4px', fontSize: '11px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-info)', background: 'var(--color-background-info)', color: 'var(--color-text-info)', cursor: 'pointer', fontWeight: 500 }}>Criar</button>
              <button onClick={() => setAddingPlan(false)} style={{ flex: 1, padding: '4px', fontSize: '11px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-tertiary)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingPlan(true)} style={{ width: '100%', padding: '7px 10px', marginTop: '4px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid transparent', background: 'transparent', color: 'var(--color-text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', textAlign: 'left' }}>
            <i className="ti ti-plus" style={{ fontSize: '15px' }} /> Novo plano
          </button>
        )}
      </div>
    </div>
  );
}
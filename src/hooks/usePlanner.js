import { useState, useEffect } from 'react';
import { INITIAL, uid as genId } from '../data/initialData';
import { db } from '../config/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export function usePlanner(userId) {
  const [state, setState] = useState(INITIAL);
  const [loading, setLoading] = useState(true);

  // 1. OUVIR A NUVEM EM TEMPO REAL
  useEffect(() => {
    if (!userId) return;

    // Referência à gaveta deste utilizador no banco de dados
    const docRef = doc(db, 'planners', userId);

    // onSnapshot fica a "escutar" mudanças 24h por dia
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setState(docSnap.data()); // Atualiza o ecrã com o que vem da nuvem
      } else {
        // Primeira vez do utilizador! Salva o quadro padrão (INITIAL)
        setDoc(docRef, INITIAL);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Limpa a escuta ao fechar a aba
  }, [userId]);

  // 2. FUNÇÃO MESTRA PARA SALVAR NA NUVEM
  const updateData = (recipe) => {
    setState(prev => {
      const newState = recipe(prev);
      if (userId) {
        // Guarda silenciosamente no Firebase em segundo plano
        setDoc(doc(db, 'planners', userId), newState).catch(err => console.error("Erro Firebase:", err));
      }
      return newState;
    });
  };

  const activePlan = state.plans?.find(p => p.id === state.activePlanId) || state.plans?.[0];

  // Helper para atualizar apenas o plano ativo
  const updateActivePlan = (s, planRecipe) => ({
    ...s,
    plans: s.plans.map(p => p.id === s.activePlanId ? planRecipe(p) : p)
  });

  // --- A PARTIR DAQUI, AS FUNÇÕES SÃO AS MESMAS, MAS USAM O "updateData" ---

  const setActivePlanId = (id) => updateData(s => ({ ...s, activePlanId: id }));

  const createPlan = (name) => {
    if (!name.trim()) return;
    updateData(s => {
      const newPlan = { id: genId(), name, buckets: [] };
      return { ...s, plans: [...s.plans, newPlan], activePlanId: newPlan.id };
    });
  };

  const updatePlanName = (planId, newName) => {
    if (!newName.trim()) return;
    updateData(s => ({ ...s, plans: s.plans.map(p => p.id === planId ? { ...p, name: newName } : p) }));
  };

  const deletePlan = (planId) => {
    updateData(s => {
      const newPlans = s.plans.filter(p => p.id !== planId);
      let nextActiveId = s.activePlanId;
      if (s.activePlanId === planId) {
        nextActiveId = newPlans.length > 0 ? newPlans[0].id : null;
      }
      return { ...s, plans: newPlans, activePlanId: nextActiveId };
    });
  };

  const createBucket = (name) => {
    if (!name.trim()) return;
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: [...p.buckets, { id: genId(), name, color: '#3b82f6', tasks: [] }]
    })));
  };

  const updateBucketName = (bucketId, newName) => {
    if (!newName.trim()) return;
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? { ...b, name: newName } : b)
    })));
  };

  const deleteBucket = (bucketId) => {
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.filter(b => b.id !== bucketId)
    })));
  };

  // TAREFAS AGORA NASCEM COM O STATUS 'NÃO INICIADO'
  const createTask = (bucketId, title) => {
    if (!title.trim()) return;
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? {
        ...b, tasks: [...b.tasks, { id: genId(), title, priority: 'medium', status: 'Não iniciado', done: false, subtasks: [], notes: '', dueDate: '' }]
      } : b)
    })));
  };

  // SINCRONIZA A ESCOLHA MANUAL DO STATUS COM A CHECKBOX
  const updateTaskField = (bucketId, taskId, field, value) => {
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? {
        ...b, tasks: b.tasks.map(t => {
          if (t.id === taskId) {
            let updates = { [field]: value };
            if (field === 'status') {
              updates.done = (value === 'Concluída');
            }
            return { ...t, ...updates };
          }
          return t;
        })
      } : b)
    })));
  };

  // SINCRONIZA A CHECKBOX COM O STATUS
  const toggleTask = (bucketId, taskId, e) => {
    if (e) e.stopPropagation();
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? {
        ...b, tasks: b.tasks.map(t => {
          if (t.id === taskId) {
            const isDone = !t.done;
            return { ...t, done: isDone, status: isDone ? 'Concluída' : (t.status === 'Concluída' ? 'Não iniciado' : t.status) };
          }
          return t;
        })
      } : b)
    })));
  };

  const deleteTask = (bucketId, taskId) => {
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? {
        ...b, tasks: b.tasks.filter(t => t.id !== taskId)
      } : b)
    })));
  };

  const moveTask = (sourceBucketId, targetBucketId, taskId) => {
    updateData(s => updateActivePlan(s, p => {
      const sourceIdStr = String(sourceBucketId);
      const targetIdStr = String(targetBucketId);
      const taskIdStr = String(taskId);

      const sourceBucket = p.buckets.find(b => String(b.id) === sourceIdStr);
      const taskToMove = sourceBucket?.tasks.find(t => String(t.id) === taskIdStr);
      
      if (!taskToMove) return p;

      return {
        ...p, buckets: p.buckets.map(b => {
          if (String(b.id) === sourceIdStr) {
            return { ...b, tasks: b.tasks.filter(t => String(t.id) !== taskIdStr) };
          }
          if (String(b.id) === targetIdStr) {
            return { ...b, tasks: [...b.tasks, taskToMove] };
          }
          return b;
        })
      };
    }));
  };

  const addSubtask = (bucketId, taskId, title) => {
    if (!title.trim()) return;
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? {
        ...b, tasks: b.tasks.map(t => t.id === taskId ? {
          ...t, subtasks: [...(t.subtasks || []), { id: genId(), title, done: false }]
        } : t)
      } : b)
    })));
  };

  const toggleSubtask = (bucketId, taskId, subtaskId, e) => {
    if (e) e.stopPropagation();
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? {
        ...b, tasks: b.tasks.map(t => t.id === taskId ? {
          ...t, subtasks: (t.subtasks || []).map(sub => sub.id === subtaskId ? { ...sub, done: !sub.done } : sub)
        } : t)
      } : b)
    })));
  };

  // --- NOVAS FUNÇÕES PARA SUBTAREFAS ---

  const deleteSubtask = (bucketId, taskId, subtaskId) => {
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? {
        ...b, tasks: b.tasks.map(t => t.id === taskId ? {
          ...t, subtasks: (t.subtasks || []).filter(sub => sub.id !== subtaskId)
        } : t)
      } : b)
    })));
  };

  const editSubtask = (bucketId, taskId, subtaskId, newTitle) => {
    if (!newTitle.trim()) return;
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? {
        ...b, tasks: b.tasks.map(t => t.id === taskId ? {
          ...t, subtasks: (t.subtasks || []).map(sub => sub.id === subtaskId ? { ...sub, title: newTitle } : sub)
        } : t)
      } : b)
    })));
  };

  return {
    state,
    loading,
    activePlan,
    setActivePlanId,
    createPlan, updatePlanName, deletePlan,
    createBucket, updateBucketName, deleteBucket,
    createTask, updateTaskField, toggleTask, deleteTask, moveTask,
    addSubtask, toggleSubtask,
    deleteSubtask, editSubtask
  };
}
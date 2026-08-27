import { useState, useEffect, useRef } from 'react';
import { INITIAL } from '../data/initialData';
import { db } from '../config/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
};

export function usePlanner(userId) {
  const [state, setState] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  
  // NOVO: Cadeado inquebrável que impede salvamentos acidentais.
  // Ele sobrevive a recarregamentos do React sem piscar.
  const isSynced = useRef(false); 

  useEffect(() => {
    if (!userId) return;

    const docRef = doc(db, 'planners', userId);

    // NOVO: A flag { includeMetadataChanges: true } é obrigatória para ler o fromCache corretamente
    const unsubscribe = onSnapshot(docRef, { includeMetadataChanges: true }, (docSnap) => {
      
      if (!docSnap.exists()) {
        // Trava 1: Se o documento não existe, mas veio do cache (offline), aborta.
        if (docSnap.metadata.fromCache) {
          console.warn("Rede instável: Lendo do cache vazio. Aguardando servidor...");
          return; 
        }
        
        // Se chegou aqui, O SERVIDOR ONLINE confirmou que a gaveta está vazia.
        setDoc(docRef, INITIAL).catch(err => console.error("Erro ao criar:", err));
        setState(INITIAL);
        setLoading(false);
        isSynced.current = true; // Abre o cadeado
      } else {
        // Carregou os dados reais do servidor
        setState(docSnap.data());
        setLoading(false);
        isSynced.current = true; // Abre o cadeado
      }
    }, (error) => {
      console.error("Erro na sincronização:", error);
    });

    return () => unsubscribe();
  }, [userId]);

  const updateData = (recipe) => {
    // NOVO (Trava 2): Se a tela tentar salvar algo antes da confirmação do servidor, o código barra.
    if (!isSynced.current) {
      console.error("Bloqueado: Tentativa de sobrescrever dados antes da sincronização online.");
      return;
    }

    setState(prev => {
      const newState = recipe(prev);
      if (userId) {
        setDoc(doc(db, 'planners', userId), newState).catch(err => console.error("Erro Firebase:", err));
      }
      return newState;
    });
  };

  const activePlan = state.plans?.find(p => p.id === state.activePlanId) || state.plans?.[0];

  const updateActivePlan = (s, planRecipe) => ({
    ...s,
    plans: s.plans.map(p => p.id === s.activePlanId ? planRecipe(p) : p)
  });

  const setActivePlanId = (id) => updateData(s => ({ ...s, activePlanId: id }));

  const createPlan = (name) => {
    if (!name.trim()) return;
    updateData(s => {
      const newPlan = { id: generateId(), name, buckets: [] };
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
      ...p, buckets: [...p.buckets, { id: generateId(), name, color: '#3b82f6', tasks: [] }]
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

  const createTask = (bucketId, title) => {
    if (!title.trim()) return;
    updateData(s => updateActivePlan(s, p => ({
      ...p, buckets: p.buckets.map(b => b.id === bucketId ? {
        ...b, tasks: [...b.tasks, { id: generateId(), title, priority: 'medium', status: 'Não iniciado', done: false, subtasks: [], notes: '', dueDate: '' }]
      } : b)
    })));
  };

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

      if (sourceIdStr === targetIdStr) return p;

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
          ...t, subtasks: [...(t.subtasks || []), { id: generateId(), title, done: false }]
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
    state, loading, activePlan, setActivePlanId, createPlan, updatePlanName, deletePlan,
    createBucket, updateBucketName, deleteBucket, createTask, updateTaskField, toggleTask, 
    deleteTask, moveTask, addSubtask, toggleSubtask, deleteSubtask, editSubtask
  };
}
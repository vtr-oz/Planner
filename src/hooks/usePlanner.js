import { useState, useEffect } from "react";
import { INITIAL, uid, BUCKET_COLORS } from "../data/initialData";

export function usePlanner() {
  // Carrega do localStorage ao iniciar, ou usa o INITIAL
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('planner_data');
    return saved ? JSON.parse(saved) : INITIAL;
  });

  // Salva no localStorage toda vez que o estado mudar
  useEffect(() => {
    localStorage.setItem('planner_data', JSON.stringify(state));
  }, [state]);

  const activePlan = state.plans.find(p => p.id === state.activePlanId);

  const setActivePlanId = (id) => {
    setState(s => ({ ...s, activePlanId: id }));
  };

  const updatePlan = (planId, fn) =>
    setState(s => ({ ...s, plans: s.plans.map(p => p.id === planId ? fn(p) : p) }));

  const updateBuckets = fn =>
    updatePlan(state.activePlanId, p => ({ ...p, buckets: fn(p.buckets) }));

  const createPlan = (name) => {
    if (!name.trim()) return;
    const id = uid();
    setState(s => ({ ...s, plans: [...s.plans, { id, name, buckets: [] }], activePlanId: id }));
  };

  const updatePlanName = (planId, name) => {
    if (!name.trim()) return;
    updatePlan(planId, p => ({ ...p, name }));
  };

  const deletePlan = (planId) => {
    setState(s => {
      // Remove o plano da lista
      const newPlans = s.plans.filter(p => p.id !== planId);
      
      // Se apagarmos o plano que está aberto, precisamos de mudar para outro
      let nextActiveId = s.activePlanId;
      if (s.activePlanId === planId) {
        nextActiveId = newPlans.length > 0 ? newPlans[0].id : null;
      }
      
      return { ...s, plans: newPlans, activePlanId: nextActiveId };
    });
  };

  const createBucket = (name) => {
    if (!name.trim()) return;
    const id = uid();
    updateBuckets(bs => [...bs, { id, name, color: BUCKET_COLORS[bs.length % BUCKET_COLORS.length], tasks: [] }]);
  };

  const updateBucketName = (bucketId, name) => {
    if (!name.trim()) return;
    updateBuckets(bs => bs.map(b => b.id === bucketId ? { ...b, name } : b));
  };

  const createTask = (bucketId, title) => {
    if (!title.trim()) return;
    const id = uid();
    updateBuckets(bs => bs.map(b => b.id === bucketId ? { ...b, tasks: [...b.tasks, { id, title, done: false, priority: 'medium', notes: '', dueDate: '', subtasks: [] }] } : b));
  };

  const moveTask = (sourceBucketId, targetBucketId, taskId) => {
    // Evita rodar código se soltar no mesmo lugar
    if (sourceBucketId === targetBucketId) return;

    updateBuckets(bs => {
      let movedTask = null;
      
      // 1. Tira a tarefa do bucket de origem
      const bsWithoutTask = bs.map(b => {
        if (b.id == sourceBucketId) {
          movedTask = b.tasks.find(t => t.id == taskId);
          return { ...b, tasks: b.tasks.filter(t => t.id != taskId) };
        }
        return b;
      });

      // 2. Coloca a tarefa no bucket de destino (se ela foi encontrada)
      if (movedTask) {
        return bsWithoutTask.map(b => {
          if (b.id == targetBucketId) {
            return { ...b, tasks: [...b.tasks, movedTask] };
          }
          return b;
        });
      }
      return bsWithoutTask;
    });
  };

  const toggleTask = (bucketId, taskId, e) => {
    e?.stopPropagation();
    updateBuckets(bs => bs.map(b => b.id === bucketId ? { ...b, tasks: b.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) } : b));
  };

  const deleteTask = (bucketId, taskId) => {
    updateBuckets(bs => bs.map(b => b.id === bucketId ? { ...b, tasks: b.tasks.filter(t => t.id !== taskId) } : b));
  };

  const deleteBucket = (bucketId) => {
    updateBuckets(bs => bs.filter(b => b.id !== bucketId));
  };

  const addSubtask = (bucketId, taskId, title) => {
    if (!title.trim()) return;
    const id = uid();
    updateBuckets(bs => bs.map(b => b.id === bucketId ? { ...b, tasks: b.tasks.map(t => t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id, title, done: false }] } : t) } : b));
  };

  const toggleSubtask = (bucketId, taskId, subId) =>
    updateBuckets(bs => bs.map(b => b.id === bucketId ? { ...b, tasks: b.tasks.map(t => t.id === taskId ? { ...t, subtasks: t.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s) } : t) } : b));

  const updateTaskField = (bucketId, taskId, field, value) =>
    updateBuckets(bs => bs.map(b => b.id === bucketId ? { ...b, tasks: b.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t) } : b));

  return {
    state,
    activePlan,
    setActivePlanId,
    createPlan,
    updatePlanName,
    deletePlan,
    createBucket,
    updateBucketName,
    createTask,
    toggleTask,
    deleteTask,
    deleteBucket,
    addSubtask,
    toggleSubtask,
    updateTaskField,
    moveTask
  };
}
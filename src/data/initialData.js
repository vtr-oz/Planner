let _id = 200;
export const uid = () => ++_id;

export const BUCKET_COLORS = ['#5B8DEF', '#E86A33', '#9B59B6', '#2ECC71', '#E74C3C', '#F39C12', '#1ABC9C', '#E91E8C'];

export const PRIORITY = { 
  high: { label: 'Alta', color: '#E74C3C' }, 
  medium: { label: 'Média', color: '#F39C12' }, 
  low: { label: 'Baixa', color: '#2ECC71' } 
};

export const INITIAL = {
  activePlanId: 1,
  plans: [
    {
      id: 1, name: "Projeto Website",
      buckets: [
        {
          id: 2, name: "A Fazer", color: '#5B8DEF',
          tasks: [
            { id: 3, title: "Criar wireframes", done: false, priority: "medium", notes: "Cobrir todas as telas principais", subtasks: [
              { id: 4, title: "Home page", done: false },
              { id: 5, title: "Página de contato", done: false },
              { id: 6, title: "Dashboard", done: true }
            ]},
            { id: 7, title: "Definir paleta de cores", done: false, priority: "low", notes: "", subtasks: [] }
          ]
        },
        {
          id: 8, name: "Em Andamento", color: '#E86A33',
          tasks: [
            { id: 9, title: "Desenvolvimento do backend", done: false, priority: "high", notes: "API REST com Node.js + Postgres", subtasks: [
              { id: 10, title: "Configurar banco de dados", done: true },
              { id: 11, title: "Criar endpoints REST", done: false }
            ]}
          ]
        },
        { id: 12, name: "Concluído", color: '#2ECC71', tasks: [] }
      ]
    }
  ]
};
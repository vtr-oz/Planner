# Task Planner - Kanban Pro

O **Task Planner** é uma aplicação de gerenciamento de tarefas baseada na metodologia Kanban, projetada para oferecer uma organização visual, fluida e eficiente. Desenvolvido com foco em simplicidade, o app permite gerenciar múltiplos projetos (planos) com um nível detalhado de controle sobre cada tarefa.

## ✨ Funcionalidades Principais

- **🗂️ Gestão Multiprojetos:** Crie, renomeie e organize diferentes planos de trabalho na barra lateral.
- **📊 Quadro Kanban Dinâmico:** Organize o fluxo de trabalho em buckets (colunas) totalmente editáveis.
- **🖱️ Drag and Drop Nativo:** Movimente suas tarefas entre colunas arrastando e soltando.
- **📝 Detalhamento de Tarefas:**
  - Definição de **Prioridades** (Baixa, Média, Alta).
  - Sistema de **Subtarefas** com cálculo automático de progresso.
  - Campo de **Notas** para descrições detalhadas.
  - **Data de Conclusão** (Due Date) com exibição visual no cartão.
- **💾 Persistência de Dados:** Integração com `localStorage` para que seus dados não sejam perdidos ao fechar o navegador.
- **📱 Design Responsivo:** Interface adaptável para Desktop e Mobile, incluindo uma sidebar retrátil (off-canvas) para telas menores.
- **🚀 Atalho Executável:** Script `.bat` configurado para iniciar o servidor e abrir o app automaticamente.

## 🛠️ Tecnologias Utilizadas

- **React.js**: Biblioteca para construção da interface reativa.
- **Vite**: Ferramenta de build de última geração para desenvolvimento rápido.
- **Custom Hooks**: Lógica de estado centralizada para fácil manutenção.
- **CSS Variables**: Sistema de design consistente e fácil de customizar.
- **Tabler Icons**: Conjunto de ícones vetoriais elegantes.

## ⚙️ Como Instalar e Rodar

1. **Clone o repositório:**

   git clone <url-do-seu-repositorio>

2. **Instale as dependências e inicie o ambiente de desenvolvimento**:

npm install
npm run dev

3. **Acesse no seu navegador**:
http://localhost:5173

🗺️ Roadmap de Evolução
O projeto está em constante evolução. Os próximos passos planejados são:

[ ] Sincronização em Nuvem: Migração do localStorage para Firebase ou Supabase (BaaS).

[ ] Autenticação: Sistema de login seguro para múltiplos usuários.

[ ] Desktop App: Encapsulamento em .exe nativo usando Tauri ou Electron.

Desenvolvido por Vitor de Oliveira
# Task Planner Pro 🚀

O **Task Planner Pro** é uma aplicação Full-Stack moderna de gerenciamento de projetos em estilo Kanban. Desenvolvida em React e Vite, a plataforma oferece sincronização de dados em tempo real e isolamento completo de workspaces por meio da infraestrutura do Firebase, permitindo uma experiência de alta performance tanto em ambientes desktop quanto mobile.

---

## 🛠️ Tech Stack

* **Frontend:** [React](https://react.dev/) (Hooks customizados, manipulação de estado complexo e arquitetura baseada em componentes).
* **Ferramenta de Build:** [Vite](https://vitejs.dev/) (Garantindo inicialização e Hot Module Replacement ultrarrápidos).
* **Autenticação & Backend:** [Firebase Authentication](https://firebase.google.com/docs/auth) (Login social com provedor Google).
* **Banco de Dados:** [Cloud Firestore](https://firebase.google.com/docs/firestore) (Banco de dados NoSQL baseado em documentos com persistência e escuta em tempo real).
* **Hospedagem & CI/CD:** [Vercel](https://vercel.com/) (Deploy automatizado sincronizado com a branch principal do Git).
* **Ícones:** [Tabler Icons](https://tabler.io/icons).

---

## ✨ Funcionalidades Principais

### 🔒 Autenticação e Privacidade Absoluta
* **Acesso via Conta Google:** Fluxo de login social ágil e seguro.
* **Workspaces Isolados:** Cada usuário possui sua própria "gaveta" no banco de dados. Usuários diferentes que acessarem a aplicação terão painéis completamente privados e invisíveis uns para os outros.
* **Indicador de Sessão:** Cabeçalho dinâmico que exibe o nome, avatar do perfil do Google e botão de logout (`signOut`).

### 📊 Estrutura de Kanban Flexível (Blocos/Buckets)
* **Gerenciamento de Planos:** Criação de múltiplos quadros de planejamento no menu lateral.
* **Buckets Personalizados:** Criação, edição de nome e exclusão de colunas (buckets) para categorizar o fluxo de trabalho dentro de cada plano.
* **Drag and Drop Confiável:** Movimentação fluida de tarefas entre colunas, com tratamento robusto e conversão de tipos de ID para consistência de dados no banco de dados.

### 📝 Gerenciamento Avançado de Tarefas
* **Ciclo de Vida e Prioridades:** Atribuição de prioridades (Alta, Média, Baixa) com estilização dinâmica e definição de datas de conclusão (`dueDate`).
* **Campo de Notas:** Área dedicada para descrições detalhadas, anotações e registros textuais com salvamento automático.
* **Mapeamento de Status Bidirecional:** Menu de status contendo as opções *Não iniciado*, *Em andamento*, *Aguardando* e *Concluída*. O status atualiza automaticamente ao marcar a checkbox da tarefa e vice-versa.

### 🏁 Subtarefas Inteligentes com Edição Inline
* **Indicador de Progresso:** Contador numérico visual (ex: `1/3`) que exibe a fração de subtarefas concluídas.
* **Edição na Própria Linha (Inline):** Ao clicar no ícone de edição ou dar um duplo clique no texto da subtarefa, o elemento transforma-se em um campo de texto dinâmico. O salvamento ocorre ao pressionar `Enter` ou ao perder o foco (`onBlur`), eliminando o uso de pop-ups intrusivos do navegador.
* **Exclusão Direta:** Botão de remoção rápida para controle total do escopo.

---

### 🔄 Atualizações Recentes (Últimos Updates)

* **(1.2) Proteção de Dados Offline (Cache Lock):** Implementação de uma trava de segurança robusta no Firebase. Se a aplicação for iniciada em um ambiente sem internet ou com rede instável, o sistema detecta que a leitura está sendo feita via cache (`fromCache`) e bloqueia qualquer tentativa de sobrescrita de dados vazios, garantindo que o seu progresso nunca seja perdido.
* **(1.2) Smart UI: Gaveta de Tarefas Concluídas:** Aprimoramento da interface para manter o foco na produtividade. Quando as tarefas são marcadas como "Concluídas", elas são dinamicamente separadas da lista principal e agrupadas em um menu retrátil (estilo sanfona) no final de cada Bucket. Isso mantém o quadro Kanban limpo, mostrando apenas o que precisa ser feito, mas mantendo o histórico acessível a um clique.
* **(1.3) Fix: Correção de bugs que causam a perda de dados recentes escritos**

---

## 🔒 Regras de Segurança do Banco de Dados (Firestore Rules)

Para garantir que nenhum dado seja interceptado ou acessado por terceiros por fora da aplicação, o banco de dados está protegido por regras granulares a nível de servidor:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /planners/{userId} {
      // O documento só pode ser lido ou alterado se o usuário estiver autenticado
      // e se o ID do documento corresponder exatamente ao UID do usuário logado.
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

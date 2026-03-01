# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o AgendaPro! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Diretrizes de Código](#diretrizes-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)

---

## 📜 Código de Conduta

Este projeto segue o [Código de Conduta do Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em seguir este código.

### Comportamentos Esperados

- Use linguagem acolhedora e inclusiva
- Respeite pontos de vista diferentes
- Aceite críticas construtivas com elegância
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

---

## 🚀 Como Posso Contribuir?

### 🐛 Reportando Bugs

Antes de criar um bug report, verifique se já não existe uma issue aberta sobre o problema.

**Como reportar um bug:**

1. Use a aba [Issues](https://github.com/seu-usuario/agendapro/issues)
2. Clique em "New Issue"
3. Selecione o template "Bug Report"
4. Preencha todas as informações solicitadas
5. Inclua:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Ambiente (navegador, sistema operacional)

### 💡 Sugerindo Melhorias

Tem uma ideia para melhorar o AgendaPro?

1. Verifique se já não existe uma issue sobre sua sugestão
2. Crie uma nova issue com o template "Feature Request"
3. Descreva detalhadamente:
   - Problema que sua sugestão resolve
   - Como você imagina a solução
   - Alternativas consideradas
   - Contexto adicional

### 📝 Melhorando a Documentação

Documentação nunca está completa! Contribuições são bem-vindas:

- Corrigir erros de digitação
- Melhorar explicações
- Adicionar exemplos
- Traduzir para outros idiomas
- Criar tutoriais em vídeo

---

## 🔧 Processo de Desenvolvimento

### 1. Fork o Repositório

```bash
# Clique em "Fork" no GitHub ou use:
gh repo fork seu-usuario/agendapro --clone
```

### 2. Crie uma Branch

```bash
# Para features
git checkout -b feature/nome-da-feature

# Para correções
git checkout -b fix/descricao-do-bug

# Para documentação
git checkout -b docs/descricao
```

### 3. Faça suas Alterações

- Escreva código limpo e legível
- Adicione comentários quando necessário
- Mantenha consistência com o código existente
- Teste todas as funcionalidades

### 4. Teste suas Alterações

```bash
# Abra o index.html no navegador
# Teste todas as funcionalidades afetadas
# Verifique se não quebrou nada
```

### 5. Commit suas Mudanças

```bash
git add .
git commit -m "tipo: descrição clara da mudança"
```

### 6. Push para o GitHub

```bash
git push origin nome-da-sua-branch
```

### 7. Abra um Pull Request

1. Vá para o repositório no GitHub
2. Clique em "Pull Requests" → "New Pull Request"
3. Selecione sua branch
4. Preencha o template de PR
5. Aguarde revisão

---

## 💻 Diretrizes de Código

### HTML

- Use HTML5 semântico
- Indentação: 4 espaços
- Atributos em ordem alfabética
- IDs únicos e descritivos
- Classes reutilizáveis

```html
<!-- ✅ Bom -->
<section class="dashboard-card" id="upcoming-appointments">
    <h3>Próximos Agendamentos</h3>
    <div class="appointments-list">
        <!-- conteúdo -->
    </div>
</section>

<!-- ❌ Evite -->
<div id="div1" class="card">
    <h3>titulo</h3>
</div>
```

### CSS

- Use variáveis CSS para cores e valores reutilizáveis
- Mobile-first quando aplicável
- BEM naming ou classes descritivas
- Agrupe propriedades logicamente

```css
/* ✅ Bom */
.dashboard-card {
    background: var(--white);
    padding: 1.5rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    transition: var(--transition);
}

.dashboard-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}

/* ❌ Evite */
.card {
    background: #fff;
    padding: 24px;
}
```

### JavaScript

- Use JavaScript moderno (ES6+)
- Nomes de variáveis descritivos
- Funções pequenas e focadas
- Comentários quando necessário
- Evite variáveis globais desnecessárias

```javascript
// ✅ Bom
function renderUpcomingAppointments() {
    const container = document.getElementById('upcoming-appointments');
    const today = new Date().toISOString().split('T')[0];
    
    const upcoming = demoData.appointments
        .filter(apt => apt.date >= today)
        .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
        .slice(0, 5);
    
    container.innerHTML = upcoming.map(apt => createAppointmentCard(apt)).join('');
}

// ❌ Evite
function render() {
    let x = document.getElementById('x');
    let y = demoData.appointments;
    // código confuso...
}
```

### Comentários

```javascript
// ✅ Bom - Explica o "porquê"
// Limita a 5 agendamentos para evitar sobrecarga visual no dashboard
const upcoming = appointments.slice(0, 5);

// ❌ Evite - Repete o "o quê" (óbvio pelo código)
// Pega os primeiros 5
const upcoming = appointments.slice(0, 5);
```

---

## 📝 Commits

### Mensagens de Commit

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição curta

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `perf`: Melhoria de performance
- `test`: Adição ou correção de testes
- `chore`: Tarefas de build, configs, etc

### Exemplos

```bash
# Nova funcionalidade
git commit -m "feat(recurring): adiciona agendamentos fixos semanais"

# Correção de bug
git commit -m "fix(bot): corrige timeout de confirmação em 30 minutos"

# Documentação
git commit -m "docs(readme): atualiza instruções de instalação"

# Estilo
git commit -m "style(css): corrige indentação no arquivo style.css"

# Refatoração
git commit -m "refactor(services): simplifica lógica de renderização"
```

---

## 🔄 Pull Requests

### Antes de Abrir um PR

- [ ] Código testado localmente
- [ ] Sem erros no console do navegador
- [ ] Documentação atualizada (se necessário)
- [ ] Commits bem descritos
- [ ] Branch atualizada com a main

### Template de PR

Ao abrir um PR, preencha o template com:

**Descrição**
- O que foi alterado?
- Por que foi alterado?
- Como foi testado?

**Tipo de Mudança**
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

**Checklist**
- [ ] Código segue as diretrizes do projeto
- [ ] Realizei revisão do meu próprio código
- [ ] Comentei código complexo
- [ ] Atualizei documentação
- [ ] Sem warnings no console
- [ ] Testei em diferentes navegadores

**Screenshots** (se aplicável)

### Processo de Revisão

1. Um mantenedor revisará seu PR
2. Pode haver solicitações de mudanças
3. Faça as alterações necessárias
4. Push das alterações (não precisa novo PR)
5. Quando aprovado, será merged

### Após o Merge

- Sua branch será deletada automaticamente
- Você será adicionado aos Contributors
- Obrigado pela contribuição! 🎉

---

## 🎨 Diretrizes de Design

### Cores

Use as variáveis CSS existentes:

```css
--primary: #3b82f6      /* Azul principal */
--success: #10b981      /* Verde sucesso */
--warning: #f59e0b      /* Laranja aviso */
--danger: #ef4444       /* Vermelho erro */
--dark: #1e293b         /* Texto escuro */
--gray: #64748b         /* Cinza médio */
--light-gray: #f1f5f9   /* Cinza claro */
```

### Espaçamento

- Pequeno: `0.5rem` (8px)
- Médio: `1rem` (16px)
- Grande: `1.5rem` (24px)
- Extra grande: `2rem` (32px)

### Tipografia

- Título principal: `2rem` (32px)
- Subtítulo: `1.5rem` (24px)
- Texto normal: `1rem` (16px)
- Texto pequeno: `0.875rem` (14px)

---

## ❓ Dúvidas?

- 📧 Email: seuemail@exemplo.com
- 💬 Discussions: [GitHub Discussions](https://github.com/seu-usuario/agendapro/discussions)
- 📱 WhatsApp: +55 (11) 99999-9999

---

## 🙏 Agradecimentos

Obrigado por contribuir com o AgendaPro! Cada contribuição, por menor que seja, faz diferença.

---

<p align="center">
  Feito com ❤️ pela comunidade
</p>

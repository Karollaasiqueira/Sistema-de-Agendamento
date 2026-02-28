# 🚀 Guia Rápido: Comandos Git para AgendaPro

Comandos essenciais para trabalhar com o repositório do AgendaPro.

---

## 📥 Clone e Setup Inicial

### Clone o Repositório

```bash
# Clone via HTTPS
git clone https://github.com/seu-usuario/agendapro.git

# Clone via SSH (recomendado se tiver chave configurada)
git clone git@github.com:seu-usuario/agendapro.git

# Entre na pasta
cd agendapro
```

### Configure seu Git (primeira vez)

```bash
# Configure seu nome
git config --global user.name "Seu Nome"

# Configure seu email
git config --global user.email "seuemail@exemplo.com"

# Verifique configuração
git config --list
```

---

## 🔄 Workflow Diário

### 1. Antes de Começar a Trabalhar

```bash
# Verifique em qual branch está
git branch

# Atualize seu repositório local
git pull origin main

# Veja o status dos arquivos
git status
```

### 2. Criar Nova Branch

```bash
# Para nova funcionalidade
git checkout -b feature/nome-da-funcionalidade

# Para correção de bug
git checkout -b fix/descricao-do-bug

# Para documentação
git checkout -b docs/descricao

# Para atualização de estilo
git checkout -b style/descricao
```

### 3. Fazer Alterações

```bash
# Edite os arquivos...

# Veja o que mudou
git status

# Veja as diferenças no código
git diff

# Adicione arquivos específicos
git add index.html
git add css/style.css

# Ou adicione todos os arquivos modificados
git add .

# Veja o que está staged
git status
```

### 4. Commit

```bash
# Commit com mensagem
git commit -m "feat: adiciona funcionalidade X"

# Commit mais detalhado (abre editor)
git commit

# Exemplo de mensagem:
# feat: adiciona timeout de confirmação
# 
# - Cliente agora tem 30 minutos para confirmar
# - Horário liberado automaticamente se não confirmar
# - Configurável de 15min a 24h
```

### 5. Push para GitHub

```bash
# Primeira vez (cria branch remota)
git push -u origin nome-da-sua-branch

# Próximas vezes
git push
```

### 6. Criar Pull Request

```bash
# Via GitHub web interface ou:
gh pr create --title "Título do PR" --body "Descrição detalhada"
```

---

## 🌿 Gerenciamento de Branches

### Ver Branches

```bash
# Locais
git branch

# Remotas
git branch -r

# Todas
git branch -a
```

### Mudar de Branch

```bash
# Mudar para branch existente
git checkout main
git checkout nome-da-branch

# Criar e mudar para nova branch
git checkout -b nova-branch
```

### Deletar Branch

```bash
# Deletar branch local
git branch -d nome-da-branch

# Forçar deleção (se não merged)
git branch -D nome-da-branch

# Deletar branch remota
git push origin --delete nome-da-branch
```

---

## 🔄 Atualizar e Sincronizar

### Buscar Atualizações

```bash
# Buscar mudanças sem aplicar
git fetch origin

# Ver o que mudou
git log origin/main..main
```

### Atualizar Branch Atual

```bash
# Atualizar com merge
git pull origin main

# Atualizar com rebase (mantém histórico linear)
git pull --rebase origin main
```

### Resolver Conflitos

```bash
# Se houver conflito ao fazer pull/merge:

# 1. Veja os arquivos conflitados
git status

# 2. Abra os arquivos, resolva os conflitos
# (busque por <<<<<<, ======, >>>>>>)

# 3. Adicione os arquivos resolvidos
git add arquivo-resolvido.js

# 4. Continue o merge/rebase
git merge --continue
# ou
git rebase --continue
```

---

## 📝 Commits

### Tipos de Commit (Conventional Commits)

```bash
# Nova funcionalidade
git commit -m "feat: adiciona agendamentos fixos"

# Correção de bug
git commit -m "fix: corrige erro no bot de WhatsApp"

# Documentação
git commit -m "docs: atualiza README com nova feature"

# Estilo/formatação
git commit -m "style: corrige indentação no CSS"

# Refatoração
git commit -m "refactor: simplifica função renderServices"

# Performance
git commit -m "perf: otimiza consulta ao Google Sheets"

# Testes
git commit -m "test: adiciona testes para timeout"

# Build/config
git commit -m "chore: atualiza .gitignore"
```

### Modificar Último Commit

```bash
# Adicionar mais arquivos ao último commit
git add arquivo-esquecido.js
git commit --amend --no-edit

# Mudar mensagem do último commit
git commit --amend -m "Nova mensagem"
```

---

## ↩️ Desfazer Mudanças

### Antes do Commit

```bash
# Descartar mudanças em arquivo específico
git checkout -- arquivo.js

# Descartar todas as mudanças
git reset --hard

# Remover arquivo do staging (mantém mudanças)
git reset HEAD arquivo.js
```

### Depois do Commit

```bash
# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer último commit (descarta mudanças)
git reset --hard HEAD~1

# Reverter commit (cria novo commit)
git revert HEAD
```

---

## 🏷️ Tags e Releases

### Criar Tag

```bash
# Tag simples
git tag v2.1.0

# Tag com mensagem
git tag -a v2.1.0 -m "Versão 2.1 - Agendamentos Fixos"

# Enviar tag para GitHub
git push origin v2.1.0

# Enviar todas as tags
git push --tags
```

### Listar Tags

```bash
# Todas as tags
git tag

# Tags que começam com v2
git tag -l "v2.*"
```

---

## 🔍 Investigar Histórico

### Ver Histórico

```bash
# Histórico completo
git log

# Histórico resumido
git log --oneline

# Últimos 5 commits
git log -5

# Com gráfico de branches
git log --oneline --graph --all

# Histórico de arquivo específico
git log -- index.html
```

### Ver Mudanças

```bash
# Diferença entre branches
git diff main..feature/nova-funcionalidade

# Diferença de commit específico
git show abc123

# Quem mudou cada linha (blame)
git blame index.html
```

---

## 🧹 Limpeza

### Limpar Arquivos Não Rastreados

```bash
# Ver o que seria removido
git clean -n

# Remover arquivos
git clean -f

# Remover arquivos e diretórios
git clean -fd
```

### Stash (Guardar Mudanças Temporariamente)

```bash
# Guardar mudanças
git stash

# Guardar com mensagem
git stash save "WIP: nova feature"

# Ver lista de stashes
git stash list

# Aplicar último stash
git stash apply

# Aplicar e remover último stash
git stash pop

# Remover último stash
git stash drop
```

---

## 🆘 Comandos de Emergência

### Commit Acidental na Branch Errada

```bash
# 1. Faça stash das mudanças
git stash

# 2. Mude para branch correta
git checkout branch-correta

# 3. Aplique as mudanças
git stash pop

# 4. Faça commit na branch certa
git add .
git commit -m "feat: mensagem"
```

### Push Acidental

```bash
# Desfazer último commit (localmente)
git reset --hard HEAD~1

# Forçar push (CUIDADO!)
git push --force origin nome-da-branch
```

### Recuperar Commit Deletado

```bash
# Ver histórico completo (mesmo deletados)
git reflog

# Recuperar commit
git checkout abc123
```

---

## 📚 Comandos Úteis

### Atalhos

```bash
# Ver status curto
git status -s

# Ver diferença entre staged e working
git diff --cached

# Ver todos os remotos
git remote -v

# Adicionar remote
git remote add upstream https://github.com/original/agendapro.git

# Atualizar do upstream (fork)
git fetch upstream
git merge upstream/main
```

---

## 🎓 Aliases Úteis

Adicione ao `.gitconfig`:

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --oneline --graph --all'
```

Agora use:

```bash
git st       # em vez de git status
git co main  # em vez de git checkout main
git visual   # para ver gráfico bonito
```

---

## ✅ Checklist Antes do Commit

- [ ] Código testado localmente
- [ ] Sem erros no console
- [ ] `git status` para ver o que vai ser commitado
- [ ] `git diff` para revisar mudanças
- [ ] Mensagem de commit clara e descritiva
- [ ] Arquivos desnecessários não incluídos

---

## 📞 Ajuda

```bash
# Ajuda geral
git help

# Ajuda de comando específico
git help commit
git help push

# Versão do Git
git --version
```

---

<p align="center">
  💡 <strong>Dica:</strong> Pratique em uma branch de teste antes de fazer mudanças importantes!
</p>

<p align="center">
  📚 Mais info: <a href="https://git-scm.com/doc">Git Documentation</a>
</p>

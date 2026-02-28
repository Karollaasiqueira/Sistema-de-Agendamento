# 🚀 Guia de Instalação - AgendaPro

Este guia fornece instruções detalhadas para instalar e executar o AgendaPro em diferentes ambientes.

---

## 📋 Índice

- [Instalação Local (Demonstração)](#instalação-local-demonstração)
- [Instalação em Produção (Stack No-Code)](#instalação-em-produção-stack-no-code)
- [Solução de Problemas](#solução-de-problemas)

---

## 💻 Instalação Local (Demonstração)

### Pré-requisitos

- ✅ Navegador moderno (Chrome, Firefox, Edge ou Safari)
- ✅ Nenhuma instalação adicional necessária!

### Opção 1: Download Direto

1. **Baixe o projeto:**
   - Clique em "Code" → "Download ZIP"
   - Extraia o arquivo ZIP

2. **Execute:**
   ```bash
   # Navegue até a pasta
   cd agendapro
   
   # Abra o index.html no navegador
   # Duplo clique no arquivo ou:
   open index.html        # MacOS
   start index.html       # Windows
   xdg-open index.html    # Linux
   ```

### Opção 2: Clone via Git

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/agendapro.git

# Entre na pasta
cd agendapro

# Abra no navegador
open index.html
```

### Opção 3: Servidor Local

Para melhor desenvolvimento, use um servidor HTTP local:

#### Python 3

```bash
cd agendapro
python -m http.server 8000

# Acesse: http://localhost:8000
```

#### Python 2

```bash
cd agendapro
python -m SimpleHTTPServer 8000

# Acesse: http://localhost:8000
```

#### Node.js (npx)

```bash
cd agendapro
npx http-server

# Acesse: http://localhost:8080
```

#### PHP

```bash
cd agendapro
php -S localhost:8000

# Acesse: http://localhost:8000
```

#### VS Code (extensão Live Server)

1. Instale a extensão "Live Server"
2. Clique direito em `index.html`
3. Selecione "Open with Live Server"

---

## 🏭 Instalação em Produção (Stack No-Code)

### Visão Geral

A stack de produção do AgendaPro é 100% no-code e gratuita:

```
WhatsApp → Evolution API → n8n → Google Sheets + Google Agenda → Glide Apps
```

**Custo Total: R$ 0,00/mês** (apenas 3,99% por transação Pix)

---

### Semana 1: Infraestrutura Básica

#### Passo 1: Criar Conta n8n

**Opção A: n8n Cloud (Recomendado para iniciantes)**

1. Acesse [n8n.io](https://n8n.io)
2. Clique em "Start Free"
3. Crie sua conta
4. Plano Free: 20 workflows, 5.000 execuções/mês

**Opção B: Self-hosted (Mais controle)**

```bash
# Via Docker (Recomendado)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Via npm
npm install n8n -g
n8n start
```

#### Passo 2: Configurar Evolution API

**Requisitos:**
- Servidor VPS (Oracle Cloud Free Tier)
- Ubuntu 20.04 ou superior

**Instalação:**

```bash
# 1. Conecte-se ao servidor
ssh usuario@seu-servidor

# 2. Instale Docker
curl -fsSL https://get.docker.com | bash

# 3. Clone a Evolution API
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# 4. Configure o ambiente
cp .env.example .env
nano .env

# Configure:
# AUTHENTICATION_API_KEY=sua-chave-segura-aqui
# BASE_URL=https://seu-dominio.com

# 5. Inicie
docker-compose up -d

# 6. Conecte seu WhatsApp
# Acesse: https://seu-dominio.com/manager
# Escaneie o QR Code com seu WhatsApp Business
```

#### Passo 3: Criar Planilha Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie nova planilha: "AgendaPro - Database"
3. Crie **6 abas**:

**Aba 1: Clientes**
```
id | name | phone | status | totalAppointments | lastVisit | created | lgpdConsent
```

**Aba 2: Agendamentos**
```
id | clientId | service | date | time | status | createdAt | confirmedAt | depositPaid | depositAmount | rescheduledCount | isRecurring | recurringId
```

**Aba 3: Servicos**
```
id | name | description | duration | valueType | value | valueMin | valueMax | active
```

**Aba 4: AgendamentosFixos**
```
id | clientId | serviceName | dayOfWeek | time | startDate | active | createdAt
```

**Aba 5: ListaEspera**
```
id | clientId | serviceId | date | entryDate | status
```

**Aba 6: Logs**
```
timestamp | type | clientId | description | metadata
```

4. Compartilhe a planilha (Qualquer pessoa com o link pode editar)
5. Copie o ID da planilha (da URL)

#### Passo 4: Conectar Google Agenda

1. Acesse [Google Calendar](https://calendar.google.com)
2. Crie um calendário novo: "AgendaPro"
3. Vá em Configurações → Integrar calendário
4. Copie o ID do calendário
5. Configure OAuth no n8n:
   - Adicione credencial "Google"
   - Autorize acesso ao Calendar

#### Passo 5: Configurar Mercado Pago

1. Crie conta em [Mercado Pago](https://www.mercadopago.com.br)
2. Acesse [Developers](https://www.mercadopago.com.br/developers)
3. Crie aplicação
4. Copie:
   - Public Key
   - Access Token
5. Ative pagamentos Pix
6. Configure notificações Webhook (para n8n)

---

### Semana 2: Workflows n8n

#### Workflow 1: Receber Mensagem WhatsApp

```
Webhook (Evolution API) 
  → Identificar Cliente (Google Sheets)
  → Verificar Consentimento LGPD
  → Processar Comando
  → Responder via Evolution API
```

#### Workflow 2: Agendar Horário

```
Comando "Agendar"
  → Listar Serviços (Google Sheets)
  → Verificar Disponibilidade (Google Agenda)
  → Criar Agendamento (Google Sheets)
  → Enviar Link Pix (Mercado Pago)
  → Aguardar Confirmação (30 min timeout)
  → Sincronizar Google Agenda
  → Enviar Confirmação (WhatsApp)
```

#### Workflow 3: Lembretes Automáticos

```
Cron (8h diariamente)
  → Buscar Agendamentos D-1 (Google Sheets)
  → Enviar Lembrete 24h (WhatsApp)

Cron (hora a hora)
  → Buscar Agendamentos em 2h (Google Sheets)
  → Enviar Lembrete 2h (WhatsApp)
```

#### Workflow 4: Agendamentos Fixos

```
Cron (segunda 9h)
  → Buscar Agendamentos Fixos Ativos (Google Sheets)
  → Para cada fixo:
    → Verificar quantos agendamentos futuros
    → Se < 4: Criar novos até 4 semanas
    → Marcar com isRecurring=true
```

#### Workflow 5: Timeout de Confirmação

```
Cron (a cada 5 minutos)
  → Buscar Agendamentos "pending" (Google Sheets)
  → Se createdAt + timeout < agora:
    → Mudar status para "cancelled"
    → Liberar horário (Google Agenda)
    → Notificar lista de espera
    → Avisar cliente (WhatsApp)
```

---

### Semana 3: Painel Glide Apps

#### Configuração:

1. Acesse [Glide Apps](https://www.glideapps.com)
2. Crie nova conta (free)
3. "New App" → "From Google Sheets"
4. Conecte sua planilha AgendaPro
5. Configure telas:
   - Dashboard
   - Serviços (CRUD)
   - Clientes
   - Agenda
   - Agendamentos Fixos
   - Relatórios
   - Configurações
6. Publique o app
7. Compartilhe link com profissionais

---

### Semana 4: Testes e Lançamento

#### Checklist de Testes:

- [ ] Bot responde corretamente a mensagens
- [ ] LGPD: Consentimento coletado no primeiro contato
- [ ] Agendamento: Fluxo completo funciona
- [ ] Pagamento: Link Pix gerado corretamente
- [ ] Timeout: Horário liberado após 30 minutos
- [ ] Cancelamento: Reembolso processado
- [ ] Lembretes: Enviados 24h e 2h antes
- [ ] Agendamentos Fixos: Criados automaticamente
- [ ] Google Agenda: Sincronizado corretamente
- [ ] Glide Apps: Todas as telas funcionando

#### Testes com Clientes Reais:

1. Selecione 3-5 clientes confiáveis
2. Explique que é um beta test
3. Peça feedback detalhado
4. Corrija problemas encontrados
5. Ajuste fluxos conforme necessário

#### Lançamento:

1. Anuncie no WhatsApp Status
2. Envie mensagem para clientes
3. Crie post no Instagram/Facebook
4. Monitore primeiras 48h ativamente
5. Responda dúvidas rapidamente
6. Colete feedback

---

## 🐛 Solução de Problemas

### Demonstração Local

**Problema: Página não carrega**
- ✅ Verifique se todos os arquivos foram extraídos
- ✅ Tente outro navegador
- ✅ Use servidor HTTP local

**Problema: Gráficos não aparecem**
- ✅ Verifique console do navegador (F12)
- ✅ Chart.js pode estar bloqueado por AdBlock
- ✅ Tente modo anônimo

**Problema: Botões não funcionam**
- ✅ Verifique console (F12) por erros JavaScript
- ✅ Recarregue a página (Ctrl+F5)
- ✅ Limpe cache do navegador

### Produção

**Problema: Evolution API não conecta WhatsApp**
- ✅ Verifique se QR Code foi escaneado
- ✅ WhatsApp deve ser Business
- ✅ Número não pode estar banido
- ✅ Verifique logs: `docker logs evolution-api`

**Problema: n8n não recebe webhooks**
- ✅ URL do webhook está correta?
- ✅ Firewall permite entrada na porta?
- ✅ Teste com Postman/Insomnia
- ✅ Verifique logs do n8n

**Problema: Google Sheets não atualiza**
- ✅ Permissões de edição corretas?
- ✅ ID da planilha está correto?
- ✅ OAuth funcionando no n8n?
- ✅ Limite de API não excedido?

**Problema: Pagamentos Pix não funcionam**
- ✅ Conta Mercado Pago verificada?
- ✅ Modo produção ativado?
- ✅ Access Token correto?
- ✅ Webhook configurado?

---

## 📞 Precisa de Ajuda?

- 📧 **Email**: seuemail@exemplo.com
- 💬 **WhatsApp**: +55 (11) 99999-9999
- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/agendapro/issues)
- 💭 **Discussions**: [GitHub Discussions](https://github.com/seu-usuario/agendapro/discussions)

---

## 📚 Recursos Adicionais

- [Documentação n8n](https://docs.n8n.io)
- [Evolution API Docs](https://doc.evolution-api.com)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Calendar API](https://developers.google.com/calendar)
- [Mercado Pago API](https://www.mercadopago.com.br/developers/pt/docs)
- [Glide Apps University](https://www.glideapps.com/docs)

---

<p align="center">
  ✅ Instalação concluída? Comece a agendar! 🚀
</p>

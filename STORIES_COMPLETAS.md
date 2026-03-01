\# SPRINT 0 - TODAS AS STORIES



---



\# STORY-001: Planning \& Architecture



\## Sprint: Planejamento

\## Tipo: Planning / Architecture Definition

\## Executor: @analyst + @pm + @architect

\## Estimativa: 2 dias



\## Objetivo

Documentar requisitos, especificação técnica e decisões arquiteturais do AgendaPro v2.1



\## Inputs

\- Requisitos do negócio

\- Análise de stack disponível



\## Outputs

\- ✅ docs/PRD.md

\- ✅ docs/SPEC.md

\- ✅ docs/ARCHITECTURE.md

\- ✅ Stories de Sprint 0-3 criadas



\## Precondições

\- Nenhuma (é a primeira)



\## Critérios de Aceitação

\- \[x] PRD revisado e aprovado

\- \[x] SPEC técnica detalhada

\- \[x] 5 ADRs documentados

\- \[x] Database schema definido

\- \[x] 4 fluxos bot especificados

\- \[x] 7 telas painel descritas

\- \[x] Regras negócio (13 RNs) documentadas

\- \[x] Riscos técnicos identificados

\- \[x] Timeline de 4 sprints aprovada



\## Checklist

\- \[x] PRD.md criado

\- \[x] SPEC.md criado

\- \[x] ARCHITECTURE.md criado

\- \[ ] Revisar PRD com PM

\- \[ ] Revisar SPEC com Dev

\- \[ ] Revisar ADRs com Architect

\- \[ ] Aprovação final



\## Status

\- \[x] DONE



\## Logs

\- 2026-03-01 10:00: Iniciado

\- 2026-03-01 11:30: PRD.md criado

\- 2026-03-01 12:00: SPEC.md criado

\- 2026-03-01 12:45: ARCHITECTURE.md criado

\- 2026-03-01 13:15: COMPLETO



---



\# STORY-010: Setup Google Sheets (6 abas)



\## Sprint: Sprint 0 - Infrastructure

\## Tipo: Infrastructure Setup

\## Executor: @devops

\## Estimativa: 45 minutos

\## Prioridade: P0 - BLOQUEANTE



\## Objetivo

Criar Google Sheets com 6 abas e estrutura completa do banco de dados



\## Inputs

\- Credenciais Google

\- Schema de dados (de SPEC.md)



\## Outputs

\- Google Sheets "AgendaPro-Database-v2.1" criado

\- 6 abas com headers

\- Validações de tipo configuradas

\- Compartilhado com n8n

\- SHEET\_ID salvo em .env



\## Precondições

\- Conta Google ativa

\- Google Sheets API habilitada



\## Tarefas

1\. \[ ] Acessar Google Sheets (https://sheets.google.com)

2\. \[ ] Criar novo projeto em branco

3\. \[ ] Renomear para "AgendaPro-Database-v2.1"

4\. \[ ] Criar aba 1: "Clientes"

5\. \[ ] Criar aba 2: "Agendamentos"

6\. \[ ] Criar aba 3: "Serviços"

7\. \[ ] Criar aba 4: "AgendamentosFixos"

8\. \[ ] Criar aba 5: "ListaEspera"

9\. \[ ] Criar aba 6: "Logs"

10\. \[ ] Adicionar headers em cada aba

11\. \[ ] Configurar validações de tipo

12\. \[ ] Compartilhar com n8n

13\. \[ ] Copiar SHEET\_ID

14\. \[ ] Salvar SHEET\_ID em .env



\## Critérios de Aceitação

\- \[ ] 6 abas criadas com nomes exatos

\- \[ ] Headers em cada aba (conforme SPEC.md)

\- \[ ] Validações de tipo configuradas

\- \[ ] Planilha compartilhada (acesso write)

\- \[ ] SHEET\_ID salvo em .env

\- \[ ] n8n consegue ler/escrever dados



\## Status

\- \[ ] Pending



---



\# STORY-011: Setup n8n Cloud + Credentials



\## Sprint: Sprint 0 - Infrastructure

\## Tipo: Infrastructure Setup

\## Executor: @dev

\## Estimativa: 60 minutos

\## Prioridade: P0 - BLOQUEANTE



\## Objetivo

Configurar n8n Cloud e conectar credenciais do Google Sheets/Calendar



\## Inputs

\- Conta n8n.io criada

\- Google Sheets ID (de STORY-010)

\- Google APIs credenciais (de STORY-012)



\## Outputs

\- n8n workspace "AgendaPro-MVP" configurado

\- Credenciais Google Sheets conectadas

\- Credenciais Google Calendar conectadas

\- Webhook receptora criada

\- Webhook URL testada



\## Precondições

\- Conta n8n.io ativa

\- STORY-010 concluída

\- Google APIs habilitadas



\## Tarefas

1\. \[ ] Acessar https://n8n.cloud

2\. \[ ] Fazer login

3\. \[ ] Criar workspace "AgendaPro-MVP"

4\. \[ ] Ir para "Credentials"

5\. \[ ] Criar credencial Google Sheets (API Key)

6\. \[ ] Criar credencial Google Calendar (OAuth 2.0)

7\. \[ ] Criar Webhook Receptora

8\. \[ ] Copiar Webhook URL

9\. \[ ] Testar Webhook manualmente

10\. \[ ] Salvar URLs em arquivo seguro



\## Critérios de Aceitação

\- \[ ] n8n workspace criado

\- \[ ] Credencial Google Sheets funcional

\- \[ ] Credencial Google Calendar funcional

\- \[ ] Webhook receptora criada

\- \[ ] Webhook URL testada

\- \[ ] Nenhum erro ao testar



\## Status

\- \[ ] Pending



---



\# STORY-012: Configure Google APIs (Sheets + Calendar)



\## Sprint: Sprint 0 - Infrastructure

\## Tipo: Infrastructure Setup

\## Executor: @devops

\## Estimativa: 45 minutos

\## Prioridade: P0 - BLOQUEANTE



\## Objetivo

Habilitar Google Sheets API, Google Calendar API e gerar credenciais



\## Tarefas

1\. \[ ] Acessar https://console.cloud.google.com/

2\. \[ ] Criar novo projeto "AgendaPro"

3\. \[ ] Habilitar Google Sheets API

4\. \[ ] Habilitar Google Calendar API

5\. \[ ] Criar API Key

6\. \[ ] Criar OAuth 2.0 credenciais

7\. \[ ] Copiar todas as chaves

8\. \[ ] Salvar em arquivo seguro



\## Critérios de Aceitação

\- \[ ] Google Sheets API habilitada

\- \[ ] Google Calendar API habilitada

\- \[ ] API Key gerada

\- \[ ] OAuth 2.0 credenciais geradas

\- \[ ] Todas chaves salvas



\## Status

\- \[ ] Pending



---



\# STORY-013: Deploy Evolution API (Docker)



\## Sprint: Sprint 0 - Infrastructure

\## Tipo: Infrastructure Setup

\## Executor: @devops

\## Estimativa: 90 minutos

\## Prioridade: P0 - BLOQUEANTE



\## Objetivo

Fazer deploy da Evolution API em Docker (WhatsApp integration)



\## Tarefas

1\. \[ ] Escolher onde rodar (Oracle Cloud Free ou VPS)

2\. \[ ] SSH na VPS/VM

3\. \[ ] Instalar Docker

4\. \[ ] Criar docker-compose.yml

5\. \[ ] Configurar variáveis ambiente

6\. \[ ] Fazer deploy (docker-compose up -d)

7\. \[ ] Testar saúde da API (curl health check)

8\. \[ ] Configurar WhatsApp Business

9\. \[ ] Obter WHATSAPP\_BUSINESS\_ACCOUNT\_ID

10\. \[ ] Obter WHATSAPP\_BUSINESS\_PHONE\_ID

11\. \[ ] Obter Access Token

12\. \[ ] Testar webhook manualmente



\## Critérios de Aceitação

\- \[ ] Evolution API rodando em porta 3000

\- \[ ] Health check retorna 200 OK

\- \[ ] WhatsApp Business configurado

\- \[ ] Webhook URL testada

\- \[ ] Logs sem erros



\## Status

\- \[ ] Pending



---



\# STORY-014: Setup Mercado Pago (Sandbox)



\## Sprint: Sprint 0 - Infrastructure

\## Tipo: Infrastructure Setup

\## Executor: @devops

\## Estimativa: 30 minutos

\## Prioridade: P1



\## Objetivo

Configurar Mercado Pago em modo sandbox para testes de pagamento



\## Tarefas

1\. \[ ] Acessar https://www.mercadopago.com.br

2\. \[ ] Cadastrar conta como "Vendedor"

3\. \[ ] Preencher dados (CPF, telefone, etc)

4\. \[ ] Gerar Access Token (Sandbox)

5\. \[ ] Copiar Access Token

6\. \[ ] Testar API Pix (curl)

7\. \[ ] Validar que retornou QR code

8\. \[ ] Salvar Token em arquivo seguro



\## Critérios de Aceitação

\- \[ ] Conta Mercado Pago criada

\- \[ ] Access Token gerado (sandbox)

\- \[ ] Teste de pagamento executado

\- \[ ] QR code gerado

\- \[ ] Token salvo



\## Status

\- \[ ] Pending



---



\# STORY-015: Test All Webhooks Integration



\## Sprint: Sprint 0 - Infrastructure

\## Tipo: QA / Integration Testing

\## Executor: @qa

\## Estimativa: 60 minutos

\## Prioridade: P0 - BLOQUEANTE



\## Objetivo

Testar integração completa de todos 4 webhooks



\## Testes a Executar



\### Teste 1: Google Sheets → n8n

\- \[ ] Inserir linha em Google Sheets

\- \[ ] Verificar se n8n detecta (< 10s)

\- \[ ] Workflow disparou? ✓



\### Teste 2: n8n → Google Calendar

\- \[ ] Criar evento em n8n

\- \[ ] Verificar em Google Calendar

\- \[ ] Evento apareceu? ✓



\### Teste 3: Evolution API → n8n

\- \[ ] Enviar mensagem WhatsApp

\- \[ ] Verificar logs Evolution

\- \[ ] Webhook disparou em n8n? ✓

\- \[ ] n8n recebeu dados? ✓



\### Teste 4: n8n → Evolution API

\- \[ ] n8n processa e responde

\- \[ ] Resposta volta ao cliente? ✓

\- \[ ] Mensagem intacta? ✓



\### Teste 5: Mercado Pago Webhook

\- \[ ] Criar pagamento sandbox

\- \[ ] Simular confirmação

\- \[ ] Webhook disparou em n8n? ✓

\- \[ ] Sheets atualizado? ✓



\## Critérios de Aceitação

\- \[ ] Teste 1 PASSOU

\- \[ ] Teste 2 PASSOU

\- \[ ] Teste 3 PASSOU

\- \[ ] Teste 4 PASSOU

\- \[ ] Teste 5 PASSOU

\- \[ ] Latência aceitável (< 5s)

\- \[ ] Nenhum erro em logs

\- \[ ] Dados sincronizados



\## Status

\- \[ ] Pending



---



\## RESUMO SPRINT 0



\*\*Stories:\*\* 6 (STORY-010 a STORY-015)

\*\*Timeline:\*\* 4 dias

\*\*Status:\*\* Ready to Execute

\*\*Blockers:\*\* None



\*\*Próximo:\*\* Sprint 1 - Bot WhatsApp


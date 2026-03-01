\# SPRINT 0 - STORIES RESTANTES (010-015)



---



\# STORY-012: Configure Google APIs (Sheets + Calendar)



\## Sprint: Sprint 0 - Infrastructure

\## Executor: @devops

\## Estimativa: 45 min



\## Objetivo

Habilitar Google Sheets API, Google Calendar API e gerar credenciais de acesso



\## Tarefas

1\. \[ ] Acessar https://console.cloud.google.com/

2\. \[ ] Criar novo projeto "AgendaPro"

3\. \[ ] Habilitar Google Sheets API

&nbsp;  - \[ ] Library → Buscar "Google Sheets API"

&nbsp;  - \[ ] Clique resultado

&nbsp;  - \[ ] Clique "Enable"

4\. \[ ] Habilitar Google Calendar API

&nbsp;  - \[ ] Library → Buscar "Google Calendar API"

&nbsp;  - \[ ] Clique resultado

&nbsp;  - \[ ] Clique "Enable"

5\. \[ ] Criar API Key

&nbsp;  - \[ ] APIs \& Services → Credentials

&nbsp;  - \[ ] + Create Credentials → API Key

&nbsp;  - \[ ] Copie a chave (AIzaSy...)

&nbsp;  - \[ ] Salve em arquivo `GOOGLE\_API\_KEY.txt`

6\. \[ ] Criar OAuth 2.0

&nbsp;  - \[ ] + Create Credentials → OAuth 2.0 ID

&nbsp;  - \[ ] Tipo: Web application

&nbsp;  - \[ ] Authorized redirect URIs: https://n8n.cloud/oauth2/callback

&nbsp;  - \[ ] Copie Client ID e Client Secret

&nbsp;  - \[ ] Salve em arquivo `GOOGLE\_OAUTH.txt`



\## Critérios de Aceitação

\- \[ ] Google Sheets API habilitada

\- \[ ] Google Calendar API habilitada

\- \[ ] API Key gerada e funcional

\- \[ ] OAuth 2.0 credenciais geradas

\- \[ ] Todas chaves salvas em arquivo seguro

\- \[ ] Nenhuma chave em código



\## Status

\- \[x] In Progress



---



\# STORY-013: Deploy Evolution API (Docker)



\## Sprint: Sprint 0 - Infrastructure

\## Executor: @devops

\## Estimativa: 90 min



\## Objetivo

Fazer deploy da Evolution API em Docker (WhatsApp integration)



\## Tarefas

1\. \[ ] Escolher onde rodar Evolution

&nbsp;  - \[ ] Opção 1: Oracle Cloud Free (recomendado)

&nbsp;  - \[ ] Opção 2: VPS barato ($5-10/mês)

2\. \[ ] SSH na VPS/VM

3\. \[ ] Instalar Docker

```bash

&nbsp;  sudo apt update

&nbsp;  sudo apt install -y docker.io docker-compose

```

4\. \[ ] Criar docker-compose.yml

5\. \[ ] Configurar variáveis ambiente

6\. \[ ] Fazer deploy

```bash

&nbsp;  docker-compose up -d

```

7\. \[ ] Testar saúde da API

```bash

&nbsp;  curl http://localhost:3000/api/health

```

8\. \[ ] Configurar WhatsApp Business

&nbsp;  - \[ ] Acessar Facebook Developers

&nbsp;  - \[ ] Criar app "AgendaPro WhatsApp"

&nbsp;  - \[ ] Obter WHATSAPP\_BUSINESS\_ACCOUNT\_ID

&nbsp;  - \[ ] Obter WHATSAPP\_BUSINESS\_PHONE\_ID

&nbsp;  - \[ ] Obter Access Token



\## Critérios de Aceitação

\- \[ ] Evolution API rodando em porta 3000

\- \[ ] Health check retorna 200 OK

\- \[ ] WhatsApp Business configurado

\- \[ ] Webhook URL testada manualmente

\- \[ ] Logs sem erros



\## Status

\- \[x] In Progress



---



\# STORY-014: Setup Mercado Pago (Sandbox)



\## Sprint: Sprint 0 - Infrastructure

\## Executor: @devops

\## Estimativa: 30 min



\## Objetivo

Configurar Mercado Pago em modo sandbox para testes de pagamento



\## Tarefas

1\. \[ ] Acessar https://www.mercadopago.com.br

2\. \[ ] Cadastrar conta como "Vendedor"

3\. \[ ] Preencher dados (CPF, telefone, etc)

4\. \[ ] Gerar Access Token (Sandbox)

&nbsp;  - \[ ] Vá para Developers → Credentials

&nbsp;  - \[ ] Selecione "Sandbox"

&nbsp;  - \[ ] Copie Access Token

&nbsp;  - \[ ] Salve em `MERCADO\_PAGO\_TOKEN.txt`

5\. \[ ] Testar API Pix

```bash

&nbsp;  curl -X POST https://api.mercadopago.com/v1/payments \\

&nbsp;    -H "Authorization: Bearer SEU\_TOKEN" \\

&nbsp;    -H "Content-Type: application/json" \\

&nbsp;    -d '{

&nbsp;      "transaction\_amount": 10.00,

&nbsp;      "payment\_method\_id": "pix",

&nbsp;      "payer": {

&nbsp;        "email": "teste@exemplo.com"

&nbsp;      }

&nbsp;    }'

```

6\. \[ ] Validar que retornou QR code



\## Critérios de Aceitação

\- \[ ] Conta Mercado Pago criada

\- \[ ] Access Token gerado (sandbox)

\- \[ ] Teste de pagamento executado com sucesso

\- \[ ] QR code gerado

\- \[ ] Token salvo em arquivo seguro



\## Status

\- \[x] In Progress



---



\# STORY-015: Test All Webhooks Integration



\## Sprint: Sprint 0 - Infrastructure

\## Executor: @qa

\## Estimativa: 60 min



\## Objetivo

Testar integração completa de todos 4 webhooks



\## Testes a Executar



\### Teste 1: Google Sheets → n8n

\- \[ ] Inserir linha manualmente em Google Sheets

\- \[ ] Verificar se n8n detecta mudança (< 10s)

\- \[ ] Workflow disparou? ✓/✗



\### Teste 2: n8n → Google Calendar

\- \[ ] Criar evento manualmente em n8n

\- \[ ] Verificar em Google Calendar (https://calendar.google.com)

\- \[ ] Evento apareceu? ✓/✗



\### Teste 3: Evolution API → n8n

\- \[ ] Enviar mensagem WhatsApp para número bot

\- \[ ] Verificar logs Evolution API

\- \[ ] Webhook disparou em n8n? ✓/✗

\- \[ ] n8n recebeu dados? ✓/✗



\### Teste 4: n8n → Evolution API (resposta)

\- \[ ] Após receber mensagem, n8n deve responder

\- \[ ] Resposta volta ao cliente via WhatsApp? ✓/✗

\- \[ ] Mensagem recebida intacta? ✓/✗



\### Teste 5: Mercado Pago Webhook

\- \[ ] Criar pagamento em sandbox

\- \[ ] Simular confirmação de pagamento

\- \[ ] Webhook disparou em n8n? ✓/✗

\- \[ ] n8n atualizou status em Sheets? ✓/✗



\## Critérios de Aceitação

\- \[ ] Teste 1 PASSOU

\- \[ ] Teste 2 PASSOU

\- \[ ] Teste 3 PASSOU

\- \[ ] Teste 4 PASSOU

\- \[ ] Teste 5 PASSOU

\- \[ ] Latência aceitável (< 5s para cada)

\- \[ ] Nenhum erro em logs

\- \[ ] Todos dados sincronizados corretamente



\## Tools Required

\- Browser

\- Curl ou Postman

\- WhatsApp (testador real)

\- Terminal



\## Status

\- \[x] In Progress



\## QA Checklist

\- \[ ] Todos testes executados

\- \[ ] Resultados documentados

\- \[ ] Erros capturados

\- \[ ] Recomendações para correção

\- \[ ] Aprovação final para Sprint 1



---



\# RESUMO SPRINT 0



\## Stories

\- ✅ STORY-010: Setup Google Sheets

\- ✅ STORY-011: Setup n8n Cloud

\- ✅ STORY-012: Configure Google APIs

\- ✅ STORY-013: Deploy Evolution API

\- ✅ STORY-014: Setup Mercado Pago

\- ✅ STORY-015: Test All Webhooks



\## Timeline

\- Sprint 0 total: 4 dias (executar em paralelo)

\- Cada story: 30-90 minutos

\- Total horas: ~18h (4 pessoas, 1 dia cada aprox)



\## Saída de Sprint 0

\- Infraestrutura 100% funcional

\- Todas webhooks testadas

\- Pronto para iniciar Sprint 1 (Bot)



\## Próximo: STORY-020 (Sprint 1 - Bot Agendar)

```


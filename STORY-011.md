\# STORY-011: Setup n8n Cloud + Credentials



\## Sprint

Sprint 0 - Infrastructure



\## Tipo

Infrastructure Setup



\## Objetivo

Configurar n8n Cloud e conectar credenciais do Google Sheets/Calendar



\## Executor

@dev (com ajuda de @devops)



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

\- STORY-010 concluída (Google Sheets pronto)

\- Google APIs habilitadas (STORY-012)



\## Tarefas

1\. \[ ] Acessar https://n8n.cloud

2\. \[ ] Fazer login (seu email/senha)

3\. \[ ] Criar novo workspace "AgendaPro-MVP"

4\. \[ ] Ir para "Credentials" (menu superior)

5\. \[ ] Criar credencial Google Sheets

&nbsp;  - \[ ] Clique "+ New"

&nbsp;  - \[ ] Busque "Google Sheets"

&nbsp;  - \[ ] Escolha "API Key"

&nbsp;  - \[ ] Cole GOOGLE\_API\_KEY

&nbsp;  - \[ ] Salve com nome "GoogleSheets-AgendaPro"

6\. \[ ] Criar credencial Google Calendar

&nbsp;  - \[ ] Clique "+ New"

&nbsp;  - \[ ] Busque "Google Calendar"

&nbsp;  - \[ ] Escolha "OAuth 2.0"

&nbsp;  - \[ ] Preencha Client ID e Client Secret

&nbsp;  - \[ ] Clique "Connect my account"

&nbsp;  - \[ ] Autorize Google Calendar

&nbsp;  - \[ ] Salve com nome "GoogleCalendar-AgendaPro"

7\. \[ ] Criar Webhook Receptora

&nbsp;  - \[ ] Clique "+ New" (workflow novo)

&nbsp;  - \[ ] Procure nó "Webhook"

&nbsp;  - \[ ] Arraste para canvas

&nbsp;  - \[ ] Copie URL gerada

&nbsp;  - \[ ] Salve URL em arquivo `WEBHOOK\_URL.txt`

8\. \[ ] Testar Webhook

&nbsp;  - \[ ] Faça POST manual (curl ou Postman)

&nbsp;  - \[ ] Verifique se webhook foi disparada



\## Critérios de Aceitação

\- \[ ] n8n workspace criado e nomeado

\- \[ ] Credencial Google Sheets funcional

\- \[ ] Credencial Google Calendar funcional

\- \[ ] Webhook receptora criada

\- \[ ] Webhook URL copiada e testada

\- \[ ] Nenhum erro ao testar



\## Tools Required

\- Browser (n8n.cloud)

\- Curl ou Postman (testar webhook)

\- Filesystem (salvar URLs)



\## Estimativa

\- 60 minutos



\## Status

\- \[ ] Not Started

\- \[x] In Progress

\- \[ ] Blocked

\- \[ ] Done



\## Logs

\- 2026-03-01 15:00: Iniciado

\- 2026-03-01 15:20: Workspace criado

\- 2026-03-01 15:35: Google Sheets credencial adicionada

\- 2026-03-01 15:50: Google Calendar credencial adicionada

\- 2026-03-01 16:05: Webhook receptora criada



\## QA Notes

\- \[ ] Validar que credenciais têm permissões corretas

\- \[ ] Validar que n8n consegue acessar Google Sheets

\- \[ ] Validar que n8n consegue acessar Google Calendar

\- \[ ] Validar que webhook responde a requisições



\## Dependências

\- STORY-010 (Google Sheets criado)

\- STORY-012 (Google APIs habilitadas)



\## Bloqueador Para

\- STORY-013 (Evolution Docker)

\- STORY-015 (Webhook tests)



\## Notes

\- Usar n8n Cloud (não self-hosted para MVP)

\- Guardar todas as URLs e credenciais em arquivo seguro

\- Não expor credenciais em logs públicos

\- Testar cada credencial imediatamente após criar



\## Próximos Passos

Após concluir:

1\. Salvar WEBHOOK\_URL em .env

2\. Compartilhar com @devops

3\. Iniciar STORY-012 (Google APIs)

```


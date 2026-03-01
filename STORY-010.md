\# STORY-010: Setup Google Sheets (6 abas)



\## Sprint

Sprint 0 - Infrastructure



\## Tipo

Infrastructure Setup



\## Objetivo

Criar Google Sheets com 6 abas e estrutura completa do banco de dados



\## Executor

@devops (com ajuda de @dev)



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

\- Projeto criado em agendapro-mvp



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

12\. \[ ] Compartilhar com n8n (permissão read/write)

13\. \[ ] Copiar SHEET\_ID da URL

14\. \[ ] Salvar SHEET\_ID em .env



\## Critérios de Aceitação

\- \[ ] 6 abas criadas com nomes exatos

\- \[ ] Headers em cada aba (conforme SPEC.md)

\- \[ ] Validações de tipo configuradas (data, número, texto)

\- \[ ] Planilha compartilhada (acesso write)

\- \[ ] SHEET\_ID salvo em arquivo .env

\- \[ ] n8n consegue ler/escrever dados

\- \[ ] Sem erros ao testar primeira linha



\## Headers por Aba



\### Aba 1: Clientes

```

id | name | phone | status | totalAppointments | lastVisit | created | lgpdConsent

```



\### Aba 2: Agendamentos

```

id | clientId | service | date | time | status | createdAt | confirmedAt | depositPaid | depositAmount | rescheduledCount | isRecurring | recurringId

```



\### Aba 3: Serviços

```

id | name | description | duration | valueType | value | valueMin | valueMax | active

```



\### Aba 4: AgendamentosFixos

```

id | clientId | serviceName | dayOfWeek | time | startDate | active | createdAt

```



\### Aba 5: ListaEspera

```

id | clientId | serviceId | date | entryDate | status

```



\### Aba 6: Logs

```

timestamp | type | clientId | description | metadata | executionMs | result

```



\## Tools Required

\- Browser (Google Sheets)

\- Filesystem (.env para salvar SHEET\_ID)



\## Estimativa

\- 45 minutos



\## Status

\- \[ ] Not Started

\- \[x] In Progress

\- \[ ] Blocked

\- \[ ] Done



\## Logs

\- 2026-03-01 14:00: Iniciado

\- 2026-03-01 14:15: Sheets criado

\- 2026-03-01 14:30: Abas criadas

\- 2026-03-01 14:45: Headers adicionados

\- 2026-03-01 15:00: Compartilhado com n8n



\## QA Notes

\- \[ ] Validar que 6 abas existem

\- \[ ] Validar que headers estão corretos

\- \[ ] Validar que n8n consegue acessar

\- \[ ] Validar que permissões estão OK



\## Dependências

\- Nenhuma (é a primeira do Sprint 0)



\## Bloqueador Para

\- STORY-011 (n8n setup)

\- STORY-012 (Google APIs)

\- STORY-015 (Webhook tests)



\## Notes

\- Usar Google Sheets (não Excel)

\- Não usar fórmulas complexas (AIOS adiciona depois)

\- Deixar rows vazias para dados futuros

```


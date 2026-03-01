\# ARCHITECTURE - Decisões e Padrões AgendaPro v2.1



\## 1. ADRs (Architecture Decision Records)



\### ADR-001: Stack No-Code + Low-Code

\*\*Decisão:\*\* Usar n8n + Evolution API + Google Sheets + Glide Apps



\*\*Alternativas Rejeitadas:\*\*

\- Backend em Node.js + PostgreSQL (custo + complexidade)

\- Firebase + Cloud Functions (vendor lock-in)



\*\*Justificativa:\*\*

\- Custo: R$ 0-50/mês

\- Tempo: 4 semanas vs 12 semanas

\- Sem DevOps necessário

\- Fácil de manter



---



\### ADR-002: Google Sheets como Database

\*\*Decisão:\*\* Usar Google Sheets como database primário



\*\*Alternativas Rejeitadas:\*\*

\- Firestore (mais caro)

\- Airtable (custo mensal)

\- PostgreSQL (infraestrutura)



\*\*Justificativa:\*\*

\- Gratuito

\- Histórico automático (auditoria)

\- Profissional pode editar manualmente

\- Integrado com Google Agenda



---



\### ADR-003: Evolution API (Self-Hosted)

\*\*Decisão:\*\* Deploy Evolution em Docker (Oracle Cloud Free ou VPS)



\*\*Alternativas Rejeitadas:\*\*

\- Twilio (R$ 0.01-0.07 por mensagem)

\- WhatsApp Business API oficial (requer aprovação)



\*\*Justificativa:\*\*

\- Gratuito

\- Webhook próprio

\- Controle total



---



\### ADR-004: Glide Apps para Painel

\*\*Decisão:\*\* Dashboard em Glide Apps (free tier)



\*\*Alternativas Rejeitadas:\*\*

\- Desenvolvemos em React/Next.js (2-3 semanas extra)

\- Softr (custo mensal)



\*\*Justificativa:\*\*

\- Pronto em 1 semana

\- Sincronização automática Google Sheets

\- Interface intuitiva



---



\### ADR-005: n8n Cloud (MVP)

\*\*Decisão:\*\* Usar n8n Cloud para MVP (1000 execuções/mês)



\*\*Após MVP:\*\*

\- Migrar para self-hosted se necessário



\*\*Justificativa:\*\*

\- Mais fácil setup

\- Gerenciado por terceiro

\- Suficiente para MVP



---



\## 2. Estrutura de Pastas

```

agendapro-mvp/

├── docs/

│   ├── PRD.md              # Requisitos do produto

│   ├── SPEC.md             # Especificação técnica

│   ├── ARCHITECTURE.md     # Este arquivo

│   ├── ADRs/               # Decision records

│   └── screenshots/        # Capturas do painel

│

├── stories/

│   ├── STORY-001.md        # Planning

│   ├── STORY-010.md        # Sprint 0

│   ├── STORY-020.md        # Sprint 1

│   └── ...

│

├── src/

│   ├── workflows/          # n8n workflows (JSON)

│   ├── scripts/            # Workers (automações)

│   └── config/             # Configurações

│

├── tests/

│   ├── integration/        # Testes integração

│   ├── e2e/                # Testes end-to-end

│   └── qa-checklist.md     # Checklist QA

│

├── .env                    # Variáveis ambiente (NÃO COMMITAR)

├── .env.example            # Template (commitar)

├── .gitignore              # Ignorar arquivos

├── README.md               # Overview projeto

└── aios-core-config.yaml   # Configuração AIOS

```



---



\## 3. Padrões de Código



\### Workflow n8n - Estrutura Padrão

Cada workflow segue este padrão:



1\. \*\*Webhook Trigger\*\* - Recebe evento

2\. \*\*Logger\*\* - Log inicial

3\. \*\*Validar Input\*\* - Valida dados

4\. \*\*Consultar Sheets\*\* - Busca dados necessários

5\. \*\*Executar Lógica\*\* - Aplica regras de negócio

6\. \*\*Atualizar Sheets\*\* - Salva resultado

7\. \*\*Sincronizar Agenda\*\* - Se necessário

8\. \*\*Enviar Resposta\*\* - Ao bot ou webhook

9\. \*\*Log Final\*\* - Auditoria



\### Nomeação de Workflows

\- `webhook-receptor-mensagens` - Receptora principal

\- `flow-agendamento-novo` - Fluxo agendar

\- `flow-cancelamento` - Fluxo cancelar

\- `sync-google-agenda` - Sincronização

\- `reminder-confirmacao-24h` - Lembretes

\- `payment-mercado-pago` - Pagamento

\- `cleanup-timeouts` - Limpeza



\### Nomeação de Variáveis

\- `event\_type` - Tipo evento

\- `client\_phone` - Telefone cliente

\- `client\_id` - ID cliente

\- `status` - Estado agendamento

\- `timestamp\_created` - Data criação (ISO 8601)

\- `sheet\_id` - ID Google Sheets

\- `operation` - Tipo operação (create/update/delete)



---



\## 4. Fluxo de Dados



\### Exemplo: Cliente envia "Agendar"

```

1\. Cliente WhatsApp: "Agendar"

&nbsp;  ↓

2\. Evolution API recebe (webhook)

&nbsp;  ↓

3\. n8n: webhook-receptor-mensagens

&nbsp;  - Valida payload

&nbsp;  - Identifica tipo (agendamento)

&nbsp;  - Roteia para flow-agendamento-novo

&nbsp;  ↓

4\. n8n: flow-agendamento-novo (parte 1)

&nbsp;  - Consulta Google Sheets (Serviços)

&nbsp;  - Bot oferece menu

&nbsp;  ↓

5\. Cliente escolhe serviço

&nbsp;  ↓

6\. n8n: flow-agendamento-novo (parte 2)

&nbsp;  - Consulta Google Calendar (datas livres)

&nbsp;  - Bot oferece datas

&nbsp;  ↓

7\. Cliente escolhe data/hora

&nbsp;  ↓

8\. n8n: flow-agendamento-novo (parte 3-7)

&nbsp;  - Cria linha Google Sheets

&nbsp;  - Cria evento Google Calendar

&nbsp;  - Inicia timeout

&nbsp;  - Aguarda confirmação

&nbsp;  ↓

9\. Cliente confirma

&nbsp;  ↓

10\. n8n: flow-agendamento-novo (parte 8)

&nbsp;   - Status → "confirmado"

&nbsp;   - Agenda lembretes

&nbsp;   - Bot responde "✅ CONFIRMADO"

&nbsp;   ↓

11\. Profissional vê em Painel Glide

```



---



\## 5. Tratamento de Erros



Cada workflow deve ter:



\- \*\*Try-Catch\*\* - Captura erros

\- \*\*Log de Erro\*\* - Registra em Sheets

\- \*\*Retentativa\*\* - Até 3 tentativas com backoff

\- \*\*Escalação\*\* - Se falhar, notifica humano

\- \*\*Recovery\*\* - Tenta estratégia alternativa



---



\## 6. Segurança



\### LGPD

\- Consentimento obrigatório primeira mensagem

\- Logs de consentimento em Sheets

\- Opção de deletar dados (futuro)



\### Autenticação

\- OAuth 2.0 para Google

\- API Keys restritas (por serviço)

\- Nenhuma chave em código



\### Validação

\- Input sanitizado

\- Sem SQL injection

\- Sem XSS



---



\## 7. Performance



\### Rate Limits

\- Google Sheets: 500 req/100s

\- Google Calendar: 1000 req/day

\- n8n Free: 1000 execuções/mês

\- Evolution API: configurável



\### Otimizações

\- Cache em n8n (quando aplicável)

\- Batch operations (Google Sheets)

\- Cleanup de timeouts expirados



---



\## 8. Monitoramento



\### Métricas

\- Tempo resposta bot (target: < 5s)

\- Taxa sucesso workflows (target: > 99%)

\- Erros por tipo

\- Uso de rate limit



\### Alertas

\- Workflow falhou 3x

\- Rate limit atingido

\- Google Sheets offline

\- Evolution API down



---



\## 9. Deployment



\### Ambientes

\- \*\*Dev\*\* - Seu computador local

\- \*\*Staging\*\* - Google Sheets cópia

\- \*\*Produção\*\* - Google Sheets real



\### Processo

1\. Develop em local

2\. Merge para staging

3\. Testes E2E em staging

4\. Deploy para produção (manual approval)

5\. Monitoramento 24h



---



\## 10. Roadmap Técnico



\### MVP v1.0 (4 semanas)

\- ✅ Agendamento básico

\- ✅ Cancelamento

\- ✅ Google Agenda sync

\- ✅ Painel Glide básico



\### v1.1 (P1 - após MVP)

\- Timeout confirmação

\- Agendamentos fixos

\- Lembretes automáticos

\- Pagamento Pix



\### v2.0 (futuro)

\- App móvel nativa

\- Multi-profissionais

\- Avaliações clientes

\- Programa fidelidade

```


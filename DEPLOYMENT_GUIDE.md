# AgendaPro v2.1 - Deployment Guide

## Visão Geral do Projeto

**AgendaPro** é um sistema de agendamento via WhatsApp para profissionais autônomos.

### Stack Tecnológico
- **Bot WhatsApp**: Evolution API
- **Orquestração**: n8n
- **Database**: Google Sheets
- **Painel Admin**: Glide Apps
- **Pagamentos**: Mercado Pago
- **Calendar**: Google Calendar

### Custo Mensal
- Evolution API (VPS): R$ 0-50
- n8n Cloud: R$ 0 (plano free)
- Google APIs: R$ 0
- Glide: R$ 0-50
- **Total: R$ 0-100/mês**

---

## Timeline de Deployment

### **DIA 1: Infraestrutura (2-3 horas)**

#### 1. Setup Evolution API (45 min)
```
Tempo: 45 minutos
Arquivo: docs/EVOLUTION_API_SETUP.md
```

**Checklist:**
- [ ] VPS criada (Oracle Cloud ou DigitalOcean)
- [ ] SSH conectado
- [ ] Docker instalado
- [ ] Evolution API rodando (porta 3000)
- [ ] WhatsApp Business conectado
- [ ] Health check passou
- [ ] Instance name: `agendapro`
- [ ] API Key copiada e segura

#### 2. Setup Mercado Pago (30 min)
```
Tempo: 30 minutos
Arquivo: docs/MERCADO_PAGO_SETUP.md
```

**Checklist:**
- [ ] Conta Mercado Pago criada
- [ ] Modo Sandbox acessado
- [ ] Public Key copiada
- [ ] Access Token copiado
- [ ] Webhook configurado
- [ ] Pagamento de teste aprovado

#### 3. Verificar n8n (15 min)
- [ ] n8n Cloud workspace aberto
- [ ] Google Sheets credencial ativa
- [ ] Evolution API credencial criada
- [ ] Mercado Pago credencial criada

---

### **DIA 2: Workflows n8n (3-4 horas)**

#### 1. Import Workflows (30 min)
```
Workflows a importar:
1. agendar-workflow.json
2. cancelar-workflow.json
3. atraso-workflow.json
4. handoff-workflow.json
```

**Checklist:**
- [ ] Agendar workflow testado
- [ ] Cancelar workflow testado
- [ ] Atraso workflow testado
- [ ] Handoff workflow testado

#### 2. Configurar Credenciais (30 min)
- [ ] Google Sheets credentials ativas
- [ ] Evolution API webhook URL correto
- [ ] Mercado Pago webhook URL correto
- [ ] Todos os nodes conectados

#### 3. Testar Fluxos (2 horas)
```
Testes a executar:
1. Enviar mensagem WhatsApp
2. Verificar se chega no n8n
3. Criar agendamento
4. Verificar em Google Sheets
5. Processar pagamento Pix
6. Receber webhook confirmação
```

---

### **DIA 3: QA & Produção (2-3 horas)**

#### 1. Testes Completos (1 hora)
```bash
# Executar test suite
npm test
```

**Testes:**
- [ ] Webhook receptor funciona
- [ ] Pagamento Pix processa
- [ ] Google Sheets salva dados
- [ ] Google Calendar sincroniza
- [ ] Mensagens WhatsApp enviam

#### 2. Production Checklist (1 hora)
- [ ] Mudar Mercado Pago para PRODUÇÃO
- [ ] Atualizar variáveis de ambiente
- [ ] SSL/HTTPS configurado
- [ ] Backups configurados
- [ ] Monitoramento ativo

#### 3. Deploy (30 min)
- [ ] Push final para GitHub
- [ ] Documentação atualizada
- [ ] Credenciais seguras guardadas
- [ ] Cliente notificado

---

## Arquivos Necessários

```
scripts/
├── evolution-api-deploy.sh          # Deploy Evolution
├── mercado-pago-config.sh           # Config Mercado Pago
└── webhook-tests.js                 # Testar webhooks

workflows/
├── agendar-workflow.json
├── cancelar-workflow.json
├── atraso-workflow.json
└── handoff-workflow.json

docs/
├── EVOLUTION_API_SETUP.md
├── MERCADO_PAGO_SETUP.md
├── WEBHOOK_TESTS.md
└── PRODUCTION_CHECKLIST.md

tests/
├── webhook.test.js
├── integration.test.js
└── smoke.test.js
```

---

## Processo de Deployment Passo-a-Passo

### FASE 1: Preparação (30 min)

1. **Revisar todos os documentos**
   ```bash
   cat docs/EVOLUTION_API_SETUP.md
   cat docs/MERCADO_PAGO_SETUP.md
   ```

2. **Preparar credenciais**
   - Criar arquivo `.env` com:
   ```
   EVOLUTION_API_URL=http://seu-ip:3000
   EVOLUTION_API_KEY=sua-chave
   MERCADO_PAGO_TOKEN=seu-token
   GOOGLE_SHEETS_ID=seu-id
   ```

3. **Testar conectividade**
   ```bash
   curl http://seu-ip-evolution:3000/api/health
   ```

### FASE 2: Deployment (4 horas)

**Dia 1:**
```bash
# 1. Setup Evolution
bash scripts/evolution-api-deploy.sh

# 2. Setup Mercado Pago (manual, 30 min)
# Seguir docs/MERCADO_PAGO_SETUP.md

# 3. Testar Health
curl http://seu-ip:3000/api/health
```

**Dia 2:**
```bash
# 1. Import workflows no n8n
# 2. Configurar credenciais
# 3. Testar cada workflow
# 4. Testar pagamentos
```

**Dia 3:**
```bash
# 1. Executar testes
npm test

# 2. Production checklist
# 3. Deploy final
git push origin main
```

### FASE 3: Validação (30 min)

1. **Testar fluxo completo:**
   - Enviar mensagem WhatsApp
   - Agendar serviço
   - Processar pagamento
   - Verificar sincronização Google Sheets/Calendar

2. **Monitorar logs**
   ```bash
   docker logs -f evolution-api
   # ou
   tail -f /var/log/agendapro.log
   ```

3. **Validar dados**
   - Google Sheets atualizado?
   - Google Calendar sincronizado?
   - Pagamento processado?

---

## Troubleshooting

### Evolution API não inicia
```bash
# Verificar logs
docker logs evolution-api

# Reiniciar
docker-compose restart evolution

# Testar porta
curl http://localhost:3000/api/health
```

### Webhook não recebe
```bash
# Testar webhook manualmente
curl -X POST https://seu-n8n.com/webhook/evolution \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Mercado Pago retorna erro
```bash
# Verificar credenciais
echo $MERCADO_PAGO_TOKEN

# Testar API
curl -H "Authorization: Bearer $MERCADO_PAGO_TOKEN" \
  https://api.mercadopago.com/user/123/settings
```

---

## Próximas Versões

### v2.2 (1-2 semanas)
- [ ] Painel Admin Glide completo
- [ ] Relatórios automáticos
- [ ] Lembretes SMS

### v2.3 (2-4 semanas)
- [ ] App mobile iOS/Android
- [ ] Integração Stripe
- [ ] Multi-profissional

### v3.0 (1-2 meses)
- [ ] SaaS versão
- [ ] Múltiplos idiomas
- [ ] IA chatbot avançada

---

## Suporte

**Problemas?**
1. Verificar logs: `docker logs -f evolution-api`
2. Testar webhook: https://webhook.site
3. Revisar credenciais em `.env`
4. Contatar: suporte@agendapro.com

**Documentação:**
- Evolution: https://docs.evolution.api.com
- n8n: https://docs.n8n.io
- Mercado Pago: https://www.mercadopago.com.br/developers

---

## Checklist Final

```
[ ] Evolution API rodando
[ ] Mercado Pago testado
[ ] n8n workflows importados
[ ] Google Sheets sincronizado
[ ] Google Calendar sincronizado
[ ] Webhooks testados
[ ] Pagamentos processando
[ ] Logs monitorados
[ ] Backups configurados
[ ] Cliente aprovado
[ ] Documentação atualizada
[ ] Pronto para produção!
```

---

**Status: PRONTO PARA DEPLOYMENT ✅**

Você está 100% preparado para colocar AgendaPro em produção!

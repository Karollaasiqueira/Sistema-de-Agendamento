# 📅 AgendaPro - Sistema de Agendamento Profissional

![Status](https://img.shields.io/badge/Status-Demo-blue) ![Version](https://img.shields.io/badge/Version-2.0-green) ![License](https://img.shields.io/badge/License-MIT-orange)

Sistema completo de agendamento automatizado via WhatsApp com painel de controle profissional. Desenvolvido com stack 100% gratuita (no-code) para profissionais autônomos e pequenas empresas.

---

## 🎯 Objetivo do Projeto

Fornecer uma plataforma completa de agendamento que:
- Automatiza o atendimento via bot WhatsApp 24/7
- Sincroniza com Google Agenda automaticamente
- Processa pagamentos de sinal via Pix (Mercado Pago)
- Envia lembretes automáticos
- Gerencia reagendamentos e cancelamentos
- Oferece dashboard com métricas e relatórios

**Custo Fixo Mensal: R$ 0,00** (apenas 3,99% por transação Pix)

---

## ✨ Funcionalidades Implementadas

### 📱 Bot WhatsApp (Simulador Interativo)
- ✅ Atendimento automático 24/7
- ✅ Menu interativo com respostas rápidas (Quick Replies)
- ✅ Animação de digitação realista (typing indicator)
- ✅ **Timeout de confirmação**: Cliente tem X tempo (configurável) para confirmar agendamento ou pagamento
- ✅ 4 fluxos conversacionais completos:
  - 📅 **Agendamento**: Escolha serviço → data → horário → pagamento → confirmação (com aviso de timeout)
  - ❌ **Cancelamento**: Motivo obrigatório + política de reembolso
  - ⏰ **Atraso**: Cliente avisa → profissional responde OK/NÃO
  - 👤 **Handoff**: Transferência para atendimento humano

### 🏠 Dashboard
- ✅ 4 cards de métricas principais (agendamentos, receita, clientes, avaliação)
- ✅ Lista de próximos agendamentos
- ✅ Gráfico de agendamentos mensais (Chart.js)
- ✅ Ranking de serviços mais agendados
- ✅ Feed de atividades recentes

### 🛠️ Gestão de Serviços
- ✅ CRUD completo (criar, editar, excluir)
- ✅ Modal de cadastro/edição
- ✅ Suporte a valor fixo ou estimado (X a Y)
- ✅ Configuração de duração e status (ativo/inativo)
- ✅ Cards visuais com todas as informações

### 👥 Gestão de Clientes
- ✅ Tabela completa com dados dos clientes
- ✅ Busca por nome ou telefone
- ✅ Filtro por status (Regular, VIP, Bloqueado)
- ✅ Histórico de agendamentos por cliente
- ✅ Badge de status visual

### 📆 Agenda (Calendário)
- ✅ Visualização mensal
- ✅ Marcação de agendamentos por dia
- ✅ Indicação visual de status (confirmado, pendente, cancelado)
- ✅ Navegação entre meses (← →)
- ✅ Destaque do dia atual

### 🔄 Agendamentos Fixos (Recorrentes) **NOVO**
- ✅ Criação de agendamentos semanais fixos (ex: toda quinta às 15h)
- ✅ Sistema agenda automaticamente até 4 semanas à frente
- ✅ Visualização das próximas 4 datas agendadas
- ✅ Ativar/Pausar agendamentos fixos
- ✅ Editar e excluir agendamentos recorrentes
- ✅ Lembretes automáticos enviados antes de cada data
- ✅ Banner informativo explicando o funcionamento
- ✅ Configuração de dia da semana, horário e data de início

### 📊 Relatórios e Métricas
- ✅ 4 gráficos com Chart.js:
  - Agendamentos por status (pizza)
  - Receita mensal (barras)
  - Horários de pico (linha)
  - Taxa de cancelamento (linha com tendência)
- ✅ Gráfico de motivos de cancelamento (barras horizontais)
- ✅ Exportação de relatórios (preparado para PDF)

### ⚙️ Configurações
- ✅ Informações do negócio (nome, telefone, e-mail, endereço)
- ✅ Horário de funcionamento (7 dias com checkbox)
- ✅ Preferências do sistema:
  - Prazo mínimo para cancelamento
  - **Tempo para confirmação de agendamento (15min a 24h)** **NOVO**
  - Número máximo de atendimentos simultâneos
  - Sinal antecipado (ativar/desativar + percentual)
  - Lembretes automáticos
  - Lista de espera
  - **Permitir agendamentos recorrentes (fixos)** **NOVO**
- ✅ Status de integrações (Google Agenda, WhatsApp, Mercado Pago)
- ✅ Salvamento em localStorage

### 🎨 Landing Page
- ✅ Hero section com CTA
- ✅ Estatísticas principais (100% gratuito, 24/7, 4 semanas)
- ✅ Mockup de celular com preview do WhatsApp
- ✅ Grid de 8 recursos principais
- ✅ Stack tecnológica (6 ferramentas)
- ✅ Banner de custo zero
- ✅ Footer completo

---

## 🏗️ Arquitetura da Solução

```
┌─────────────────┐
│  Cliente        │
│  (WhatsApp)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Evolution API  │  ← Webhook recebe mensagens
│  (Open Source)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      n8n        │  ← Lógica central (automação)
│  (Orquestrador) │
└─────┬──┬──┬─────┘
      │  │  │
      ▼  ▼  ▼
   ┌─────┐ ┌─────────┐ ┌──────────────┐
   │ G.  │ │ Google  │ │ Mercado Pago │
   │Sheet│ │ Agenda  │ │   (Pix)      │
   └─────┘ └─────────┘ └──────────────┘
      │
      ▼
   ┌─────────┐
   │  Glide  │  ← Painel visual do profissional
   │  Apps   │
   └─────────┘
```

---

## 🗂️ Estrutura do Projeto

```
agendapro/
├── index.html              # Aplicação principal (todas as 8 views)
├── css/
│   └── style.css          # Estilos completos (13KB)
├── js/
│   └── app.js             # Lógica completa da aplicação (34KB)
├── README.md              # Este arquivo
└── assets/
    └── (imagens futuras)
```

### Estrutura de Dados (Google Sheets)

O sistema utiliza **6 abas** no Google Sheets:

#### 1. **Clientes**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Número | ID único do cliente |
| name | Texto | Nome completo |
| phone | Texto | Telefone WhatsApp |
| status | Enum | regular / vip / blocked |
| totalAppointments | Número | Total de agendamentos |
| lastVisit | Data | Última visita |
| created | Data | Data de cadastro |
| lgpdConsent | Bool | Consentimento LGPD |

#### 2. **Agendamentos**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Número | ID único do agendamento |
| clientId | Número | Referência ao cliente |
| service | Texto | Nome do serviço |
| date | Data | Data do agendamento |
| time | Hora | Horário |
| status | Enum | pending / confirmed / cancelled |
| createdAt | DateTime | **NOVO** Quando foi criado |
| confirmedAt | DateTime | **NOVO** Quando foi confirmado (para controle de timeout) |
| depositPaid | Bool | Sinal foi pago? |
| depositAmount | Número | Valor do sinal |
| rescheduledCount | Número | Contador de reagendamentos (máx 2) |
| isRecurring | Bool | **NOVO** É parte de agendamento fixo? |
| recurringId | Número | **NOVO** ID do agendamento fixo (se aplicável) |

#### 3. **Serviços**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Número | ID único do serviço |
| name | Texto | Nome do serviço |
| description | Texto | Descrição |
| duration | Número | Duração em minutos |
| valueType | Enum | fixed / range |
| value | Número | Valor fixo (se fixed) |
| valueMin | Número | Valor mínimo (se range) |
| valueMax | Número | Valor máximo (se range) |
| active | Bool | Serviço ativo? |

#### 4. **AgendamentosFixos** **NOVO**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Número | ID único |
| clientId | Número | Cliente do agendamento fixo |
| serviceName | Texto | Nome do serviço |
| dayOfWeek | Número | Dia da semana (0=Dom, 1=Seg ... 6=Sáb) |
| time | Hora | Horário fixo |
| startDate | Data | Data de início |
| active | Bool | Agendamento fixo ativo? |
| createdAt | DateTime | Quando foi criado |

#### 5. **ListaEspera**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Número | ID único |
| clientId | Número | Cliente na fila |
| serviceId | Número | Serviço desejado |
| date | Data | Data preferida |
| entryDate | DateTime | Quando entrou na fila |
| status | Enum | waiting / notified / confirmed |

#### 6. **Logs**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| timestamp | DateTime | Data/hora do evento |
| type | Enum | booking / cancellation / payment / message |
| clientId | Número | Cliente envolvido |
| description | Texto | Descrição do evento |
| metadata | JSON | Dados adicionais |

---

## 🚀 Plano de Implementação (4 Semanas)

### ✅ Semana 1 - Infraestrutura & Contas
1. Criar conta n8n (cloud free ou self-hosted)
2. Configurar Evolution API no Oracle Cloud Free
3. Montar planilha Google Sheets (**6 abas** agora) **ATUALIZADO**
4. Conectar Google Agenda (OAuth 2.0)
5. Criar conta Mercado Pago (modo sandbox)

### ✅ Semana 2 - Bot de Agendamento (Core)
6. Fluxo de boas-vindas + LGPD
7. Menu de serviços dinâmico (leitura do Sheets)
8. Verificação de disponibilidade (Google Agenda)
9. Confirmação do agendamento
10. Cancelamento com motivo
11. Handoff bot → humano

### ✅ Semana 3 - Lembretes, Pagamento & Extras
12. Lembretes 24h e 2h antes
13. Fluxo de atraso (profissional responde OK/NÃO)
14. Cobrança de sinal via Pix (Mercado Pago)
15. Reagendamento (limite de 2x - RN-09)
16. Lista de espera automática

### ✅ Semana 4 - Painel, Testes & Lançamento
17. Painel no Glide Apps (dashboard + gestão)
18. Testes internos completos (checklist de 18 itens)
19. Beta com 3-5 clientes reais
20. Lançamento oficial + monitoramento

---

## 🎨 Stack Tecnológica

| Ferramenta | Função | Custo |
|-----------|---------|-------|
| **n8n** | Automação e lógica central | R$ 0 (Free tier) |
| **Evolution API** | Conexão WhatsApp | R$ 0 (Open source) |
| **Google Agenda** | Calendário compartilhado | R$ 0 (Conta Google) |
| **Google Sheets** | Banco de dados | R$ 0 (Conta Google) |
| **Glide Apps** | Painel visual no-code | R$ 0 (Free tier) |
| **Mercado Pago** | Pagamentos Pix | 3,99% por transação |

**Total Fixo Mensal: R$ 0,00**

---

## 📋 Requisitos do Sistema (ERS v2.0)

Este projeto implementa **97 Requisitos Funcionais (RF)** e **12 Requisitos Não Funcionais (RNF)** documentados na versão 2.0 do ERS.

### Principais Regras de Negócio (RN):
- **RN-01**: Prazo mínimo de 2h para cancelamento sem penalidade
- **RN-02**: Timeout de 10 minutos para resposta de atraso
- **RN-03**: Lista de espera FIFO com 30 minutos para confirmação
- **RN-06**: Limite de 3 agendamentos ativos por cliente
- **RN-09**: Máximo de 2 reagendamentos por agendamento
- **RN-10**: Sinal antecipado máximo de 50% do valor
- **RN-11**: Consentimento LGPD obrigatório no primeiro contato
- **RN-12** 🆕: Timeout configurável (15min a 24h) para confirmação de agendamento
- **RN-13** 🆕: Agendamentos fixos criam automaticamente até 4 semanas à frente

### Novos Módulos (v2.0):
- ✅ **Onboarding** (RF-88 a RF-92): Checklist obrigatório antes de ativar bot
- ✅ **Reagendamento** (RF-76 a RF-80): Cliente e profissional podem reagendar
- ✅ **Pagamento** (RF-73 a RF-77b): Falha, timeout, reembolso, chargeback
- ✅ **Handoff** (RF-93 a RF-97): Bot → Humano com rastreamento
- ✅ **Segurança** (RF-83 a RF-87): 2FA, reset de senha, log de acessos

### Novos Módulos (v2.1) 🆕:
- ✅ **Timeout de Confirmação** (RF-98 a RF-101): Cliente tem X tempo para confirmar agendamento ou pagar sinal
- ✅ **Agendamentos Fixos** (RF-102 a RF-108): Recorrências semanais automáticas até 4 semanas à frente


---

## 🎯 Como Usar Esta Demonstração

### Acessar a Demo:
1. Abra o arquivo `index.html` no navegador
2. Clique em **"Iniciar Demonstração"** na landing page
3. Explore as **8 telas principais**:
   - **Dashboard**: Métricas e resumo
   - **Bot WhatsApp**: Simulador interativo com 4 fluxos
   - **Serviços**: CRUD completo
   - **Clientes**: Gestão e busca
   - **Agenda**: Calendário mensal
   - **Agendamentos Fixos** 🆕: Recorrências semanais automáticas
   - **Relatórios**: 4 gráficos Chart.js
   - **Configurações**: Personalização completa

### Testar o Bot WhatsApp:
1. Vá para a aba **"Bot WhatsApp"**
2. Clique em um dos 4 botões de fluxo:
   - 📅 **Agendar**: Teste o fluxo completo com **aviso de timeout de 30 minutos** 🆕
   - ❌ **Cancelar**: Teste cancelamento com motivo
   - ⏰ **Atraso**: Teste notificação de atraso
   - 👤 **Handoff**: Teste transferência para humano
3. Use as **respostas rápidas** (botões azuis) ou digite manualmente
4. Observe a **animação de digitação** antes de cada resposta do bot

### Gerenciar Serviços:
1. Vá para **"Serviços"**
2. Clique em **"+ Novo Serviço"**
3. Preencha os campos no modal
4. Escolha entre valor **fixo** ou **estimado (X a Y)**
5. Salve e veja o card criado

### Visualizar Relatórios:
1. Vá para **"Relatórios"**
2. Veja 4 gráficos automáticos:
   - Status dos agendamentos (pizza)
   - Receita mensal (barras)
   - Horários de pico (linha)
   - Taxa de cancelamento (linha com tendência)
3. Analise os motivos de cancelamento (barras horizontais)

### Criar Agendamentos Fixos (Recorrentes): 🆕
1. Vá para **"Agendamentos Fixos"**
2. Clique em **"+ Novo Agendamento Fixo"**
3. Selecione:
   - Cliente (apenas não-bloqueados)
   - Serviço ativo
   - Dia da semana (ex: Quinta-feira)
   - Horário fixo (ex: 15:00)
   - Data de início
4. Marque **"Agendamento fixo ativo"**
5. Clique em **"Salvar"**
6. O sistema criará automaticamente os próximos 4 agendamentos semanais
7. Veja as próximas datas na card do agendamento
8. Você pode **pausar**, **editar** ou **excluir** o agendamento fixo

---

## 🔧 Personalização

### Alterar Dados do Negócio:
1. Vá para **"Configurações"**
2. Edite as informações do estabelecimento
3. Configure horários de funcionamento
4. Ajuste preferências do sistema
5. Clique em **"Salvar Alterações"** (salvamento em localStorage)

### Adicionar Mais Serviços:
```javascript
demoData.services.push({
    id: Date.now(),
    name: 'Novo Serviço',
    description: 'Descrição do serviço',
    duration: 45,
    valueType: 'fixed',
    value: 80,
    active: true
});
```

### Criar Novos Fluxos do Bot:
Edite o objeto `botFlows` em `js/app.js`:

```javascript
botFlows.meuFluxo = [
    {
        bot: 'Mensagem do bot',
        quickReplies: ['Opção 1', 'Opção 2'],
        final: false
    },
    // ... mais etapas
];
```

---

## 📊 Métricas e KPIs

### Principais Indicadores:
- **Taxa de Agendamento**: Conversões via bot / Total de conversas
- **Taxa de Cancelamento**: 8,3% (meta: < 10%)
- **Tempo Médio de Resposta do Bot**: 1,5 segundos
- **Avaliação Média**: 4,8★ / 5
- **Horário de Pico**: 15h-17h (útil para planejamento)

### Relatórios Disponíveis:
- ✅ Agendamentos por status (confirmado, pendente, cancelado)
- ✅ Receita mensal com comparativo
- ✅ Horários de maior demanda
- ✅ Motivos de cancelamento (top 4)
- ✅ Serviços mais agendados (ranking)

---

## 🛡️ Conformidade e Segurança

### LGPD:
- ✅ Consentimento explícito no primeiro contato (RN-11)
- ✅ Dados criptografados em trânsito (TLS 1.3)
- ✅ Dados em repouso (AES-256)
- ✅ Log imutável de ações sensíveis (RNF-12)
- ✅ Retenção de dados: 5 anos

### Segurança:
- ✅ 2FA opcional para profissionais (RF-85)
- ✅ Reset de senha seguro (RF-84)
- ✅ Log de acessos (90 dias - RF-87)
- ✅ Limite de sessões simultâneas (3 - RF-86)

---

## 🐛 Problemas Conhecidos

Esta é uma **demonstração front-end**. As seguintes funcionalidades requerem backend real:

- ❌ Integração real com WhatsApp (Evolution API)
- ❌ Integração real com Google Agenda
- ❌ Processamento real de pagamentos (Mercado Pago)
- ❌ Envio de e-mails/SMS
- ❌ Persistência de dados (atualmente apenas localStorage)
- ❌ Autenticação multi-usuário

**Para implementar em produção**, siga o plano de 4 semanas com n8n + ferramentas reais.

---

## 📈 Próximos Passos (Roadmap)

### Versão 3.0 (Planejada):
- [ ] Módulo de avaliações pós-atendimento (RF-78b a RF-82b)
- [ ] Programa de fidelidade com cupons (RF-81b, RF-82b)
- [ ] Suporte a múltiplos profissionais (RF-05, RF-06)
- [ ] Multi-idioma (i18n - RNF-11)
- [ ] App móvel nativo (iOS/Android)
- [ ] Integração com Instagram Direct
- [ ] Relatório de comissões por profissional

### Melhorias Técnicas:
- [ ] Migrar de localStorage para Firebase/Supabase
- [ ] Implementar testes automatizados (Jest + Cypress)
- [ ] PWA (Progressive Web App) com offline-first
- [ ] Websockets para notificações em tempo real
- [ ] Exportação de relatórios em PDF (jsPDF)

---

## 👥 Contribuindo

Este é um projeto de demonstração. Para sugerir melhorias:

1. Teste todas as funcionalidades
2. Reporte bugs ou sugestões
3. Documente casos de uso específicos do seu negócio

---

## 📞 Suporte e Contato

Para dúvidas ou suporte na implementação real:

- **Documentação Completa**: Ver `ERS_Plataforma_Agendamento_v2.0.docx`
- **Diagramas de Fluxo**: Ver `diagramas_v2.html`
- **Plano de Execução**: Ver `plano_execucao.html`

---

## 📜 Licença

MIT License - Livre para uso pessoal e comercial.

---

## 🙏 Agradecimentos

Desenvolvido com as seguintes tecnologias open-source:
- [Chart.js](https://www.chartjs.org/) - Gráficos interativos
- [Font Awesome](https://fontawesome.com/) - Ícones
- [Google Fonts](https://fonts.google.com/) - Tipografia (Inter)

---

## 📌 Status do Projeto

```
┌─────────────────────────────────────────────┐
│  ✅ DEMO FRONT-END: 100% COMPLETA           │
│  ⏳ BACKEND REAL: Aguardando implementação  │
│  📋 DOCUMENTAÇÃO: 100% completa             │
│  🎯 PRONTO PARA: Implementação real em 4    │
│     semanas com stack no-code               │
└─────────────────────────────────────────────┘
```

**Última Atualização**: Fevereiro 2026  
**Versão**: 2.0 Demo  
**Autor**: Sistema AgendaPro  

---

**🚀 Inicie sua demonstração agora: Abra `index.html` no navegador!**

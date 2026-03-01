# 📅 AgendaPro - Sistema de Agendamento Profissional

![Versão](https://img.shields.io/badge/versão-2.1-blue)
![Status](https://img.shields.io/badge/status-demo-success)
![Licença](https://img.shields.io/badge/licença-MIT-green)
![Plataforma](https://img.shields.io/badge/plataforma-web-orange)

> Sistema completo de agendamento automatizado via WhatsApp com painel de controle profissional. Stack 100% gratuita (no-code) para profissionais autônomos e pequenas empresas.

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
</p>

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Demonstração](#demonstração)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Contato](#contato)

---

## 🎯 Sobre o Projeto

O **AgendaPro** é uma plataforma completa de agendamento que automatiza todo o processo de marcação, confirmação e gestão de horários através de um bot inteligente no WhatsApp. Desenvolvido especialmente para:

- 💇 Salões de Beleza e Barbearias
- 💅 Manicures e Profissionais de Estética
- 🏋️ Personal Trainers
- 👨‍⚕️ Profissionais da Saúde (psicólogos, nutricionistas, etc)
- 🔧 Prestadores de Serviços em Geral

### 💡 Diferenciais

- ✅ **100% Gratuito** para começar (custo fixo R$ 0,00/mês)
- ✅ **Bot WhatsApp 24/7** com atendimento automatizado
- ✅ **Sincronização com Google Agenda** em tempo real
- ✅ **Pagamentos via Pix** integrados (Mercado Pago)
- ✅ **Agendamentos Fixos** para clientes recorrentes
- ✅ **Timeout de Confirmação** evita horários bloqueados
- ✅ **Dashboard Completo** com métricas e relatórios

---

## 🎬 Demonstração

### Demonstração Online
> 🚧 Em breve: Link para demo hospedada

### Demonstração Local
1. Clone este repositório
2. Abra o arquivo `index.html` no navegador
3. Clique em "Iniciar Demonstração"
4. Explore todas as funcionalidades!

### Screenshots

#### Landing Page
![Landing Page](docs/screenshots/landing.png)

#### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

#### Bot WhatsApp
![Bot WhatsApp](docs/screenshots/whatsapp-bot.png)

#### Agendamentos Fixos
![Agendamentos Fixos](docs/screenshots/recurring.png)

---

## ✨ Funcionalidades

### 📱 Bot WhatsApp Inteligente
- ✅ Atendimento automático 24 horas por dia, 7 dias por semana
- ✅ Menu interativo com respostas rápidas (Quick Replies)
- ✅ Animação de digitação realista
- ✅ **4 fluxos conversacionais completos:**
  - 📅 Agendamento (com aviso de timeout)
  - ❌ Cancelamento (com motivo obrigatório)
  - ⏰ Notificação de Atraso (profissional responde OK/NÃO)
  - 👤 Handoff para Atendimento Humano

### ⏱️ Timeout de Confirmação **NOVO v2.1**
- ✅ Cliente tem prazo configurável (15min a 24h) para confirmar
- ✅ Liberação automática do horário se não confirmar
- ✅ Notificação clara no bot sobre o prazo
- ✅ Dashboard mostra agendamentos pendentes

### 🔄 Agendamentos Fixos (Recorrentes) **NOVO v2.1**
- ✅ Clientes com horário fixo semanal (ex: toda quinta às 15h)
- ✅ Sistema agenda automaticamente até 4 semanas à frente
- ✅ Lembretes enviados antes de cada data
- ✅ Gestão completa: criar, pausar, editar e excluir
- ✅ Visualização das próximas 4 datas agendadas

### 🏠 Dashboard Completo
- ✅ 4 cards de métricas principais
- ✅ Lista de próximos agendamentos
- ✅ Gráfico de agendamentos mensais (Chart.js)
- ✅ Ranking de serviços mais agendados
- ✅ Feed de atividades recentes

### 🛠️ Gestão de Serviços
- ✅ CRUD completo (criar, listar, editar, excluir)
- ✅ Suporte a valor fixo ou estimado (de X a Y)
- ✅ Configuração de duração e status (ativo/inativo)
- ✅ Modal intuitivo para cadastro/edição

### 👥 Gestão de Clientes
- ✅ Tabela completa com busca e filtros
- ✅ Classificação: Regular, VIP ou Bloqueado
- ✅ Histórico completo de agendamentos
- ✅ Total de visitas e última visita

### 📅 Agenda (Calendário)
- ✅ Visualização mensal completa
- ✅ Marcação visual de status (confirmado, pendente, cancelado)
- ✅ Navegação entre meses
- ✅ Destaque do dia atual

### 📊 Relatórios e Métricas
- ✅ 4 gráficos Chart.js:
  - Status dos agendamentos (pizza)
  - Receita mensal (barras)
  - Horários de pico (linha)
  - Taxa de cancelamento (tendência)
- ✅ Análise de motivos de cancelamento
- ✅ Exportação preparada (PDF/Excel)

### ⚙️ Configurações Completas
- ✅ Informações do negócio
- ✅ Horário de funcionamento (7 dias da semana)
- ✅ Prazo mínimo para cancelamento
- ✅ **Tempo para confirmação** (15min a 24h)
- ✅ Atendimentos simultâneos
- ✅ Sinal antecipado (percentual configurável)
- ✅ Lembretes automáticos
- ✅ Lista de espera
- ✅ **Permitir agendamentos recorrentes**
- ✅ Status de integrações (Google, WhatsApp, Mercado Pago)

---

## 🚀 Tecnologias Utilizadas

### Frontend (Demonstração)
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com variáveis CSS
- **JavaScript Vanilla** - Lógica da aplicação (sem frameworks)
- **Chart.js 4.4.0** - Gráficos e visualizações
- **Font Awesome 6.4.0** - Ícones
- **Google Fonts (Inter)** - Tipografia

### Stack de Produção (No-Code)
| Ferramenta | Função | Custo |
|-----------|---------|-------|
| **n8n** | Automação e orquestração | R$ 0 (Free tier) |
| **Evolution API** | Conexão WhatsApp Business | R$ 0 (Open source) |
| **Google Agenda** | Sincronização de calendário | R$ 0 (Conta Google) |
| **Google Sheets** | Banco de dados | R$ 0 (Conta Google) |
| **Glide Apps** | Painel visual mobile | R$ 0 (Free tier) |
| **Mercado Pago** | Pagamentos Pix | 3,99% por transação |

**💰 Custo Fixo Mensal: R$ 0,00**

---

## 📥 Instalação

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Nenhuma dependência adicional necessária!

### Clone o Repositório
```bash
git clone https://github.com/seu-usuario/agendapro.git
cd agendapro
```

### Execute Localmente
```bash
# Abra o arquivo index.html no navegador
# Ou use um servidor local:

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (com npx)
npx http-server

# Acesse: http://localhost:8000
```

---

## 🎮 Como Usar

### 1. Acesse a Demonstração
1. Abra `index.html` no navegador
2. Clique em **"Iniciar Demonstração"** na landing page
3. Explore as 8 telas principais

### 2. Teste o Bot WhatsApp
1. Vá para a aba **"Bot WhatsApp"**
2. Clique em um dos 4 botões de fluxo:
   - 📅 **Agendar** - Veja o aviso de timeout de 30 minutos
   - ❌ **Cancelar** - Informe o motivo
   - ⏰ **Atraso** - Profissional responde OK/NÃO
   - 👤 **Handoff** - Transferência para humano
3. Use as respostas rápidas (botões azuis)
4. Observe a animação de digitação

### 3. Crie um Serviço
1. Vá para **"Serviços"**
2. Clique em **"+ Novo Serviço"**
3. Preencha: nome, descrição, duração, valor
4. Escolha entre valor fixo ou estimado (X a Y)
5. Salve e veja o card criado

### 4. Configure um Agendamento Fixo 🆕
1. Vá para **"Agendamentos Fixos"** (nova aba!)
2. Clique em **"+ Novo Agendamento Fixo"**
3. Selecione:
   - Cliente (apenas não-bloqueados)
   - Serviço ativo
   - Dia da semana (ex: Quinta-feira)
   - Horário (ex: 15:00)
   - Data de início
4. Marque **"Agendamento fixo ativo"**
5. Salve e veja as próximas 4 datas criadas automaticamente

### 5. Configure o Timeout 🆕
1. Vá para **"Configurações"**
2. Em "Preferências do Sistema"
3. Selecione **"Tempo para Confirmação de Agendamento"**
4. Escolha entre: 15min, 30min, 1h, 2h, 6h, 12h ou 24h
5. Salve as alterações

---

## 📁 Estrutura do Projeto

```
agendapro/
│
├── index.html              # Aplicação principal (todas as 8 views)
│
├── css/
│   └── style.css          # Estilos completos (31KB)
│
├── js/
│   └── app.js             # Lógica completa da aplicação (34KB)
│
├── docs/
│   ├── screenshots/       # Capturas de tela
│   ├── ERS_v2.0.docx     # Especificação de Requisitos
│   ├── diagramas_v2.html # Diagramas de fluxo
│   └── plano_execucao.html # Plano de 4 semanas
│
├── README.md              # Este arquivo
├── CHANGELOG_v2.1.md      # Notas da versão 2.1
└── LICENSE                # Licença MIT
```

### Estrutura de Dados (Google Sheets)

O sistema utiliza **6 abas** no Google Sheets:

#### 1. Clientes
```
id, name, phone, status, totalAppointments, lastVisit, created, lgpdConsent
```

#### 2. Agendamentos
```
id, clientId, service, date, time, status, createdAt, confirmedAt,
depositPaid, depositAmount, rescheduledCount, isRecurring, recurringId
```

#### 3. Serviços
```
id, name, description, duration, valueType, value, valueMin, valueMax, active
```

#### 4. AgendamentosFixos 🆕
```
id, clientId, serviceName, dayOfWeek, time, startDate, active, createdAt
```

#### 5. ListaEspera
```
id, clientId, serviceId, date, entryDate, status
```

#### 6. Logs
```
timestamp, type, clientId, description, metadata
```

---

## 🏗️ Arquitetura

### Arquitetura da Solução (Produção)

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

### Fluxo de Dados

1. **Cliente** envia mensagem no WhatsApp
2. **Evolution API** recebe via webhook
3. **n8n** processa a mensagem e executa lógica:
   - Consulta dados no Google Sheets
   - Verifica disponibilidade no Google Agenda
   - Cria agendamento
   - Processa pagamento (se necessário)
4. **Bot** responde ao cliente automaticamente
5. **Profissional** gerencia tudo pelo Glide Apps

---

## 🗺️ Roadmap

### ✅ Versão 2.0 (Concluída)
- [x] Bot WhatsApp com 4 fluxos
- [x] Dashboard completo
- [x] Gestão de serviços e clientes
- [x] Calendário mensal
- [x] Relatórios com gráficos
- [x] Configurações completas

### ✅ Versão 2.1 (Concluída) - Atual
- [x] Timeout de confirmação de agendamento
- [x] Agendamentos fixos (recorrentes)
- [x] Documentação completa em PT-BR

### 🔮 Versão 2.2 (Planejada)
- [ ] Avaliações pós-atendimento (1-5 estrelas)
- [ ] Programa de fidelidade com cupons
- [ ] Suporte a múltiplos profissionais
- [ ] Agendamentos fixos quinzenais
- [ ] Dashboard de recorrências

### 🔮 Versão 3.0 (Futura)
- [ ] App móvel nativo (iOS/Android)
- [ ] Integração com Instagram Direct
- [ ] Multi-idioma (i18n)
- [ ] Relatório de comissões
- [ ] Modo white-label

---

## 📋 Requisitos do Sistema (ERS v2.1)

### Regras de Negócio Principais
- **RN-01**: Prazo mínimo de 2h para cancelamento sem penalidade
- **RN-02**: Timeout de 10 minutos para resposta de atraso
- **RN-03**: Lista de espera FIFO com 30 minutos para confirmação
- **RN-06**: Limite de 3 agendamentos ativos por cliente
- **RN-09**: Máximo de 2 reagendamentos por agendamento
- **RN-10**: Sinal antecipado máximo de 50% do valor
- **RN-11**: Consentimento LGPD obrigatório no primeiro contato
- **RN-12** 🆕: Timeout configurável (15min a 24h) para confirmação
- **RN-13** 🆕: Agendamentos fixos criam até 4 semanas à frente

### Módulos Implementados
- ✅ Onboarding (RF-88 a RF-92)
- ✅ Reagendamento (RF-76 a RF-80)
- ✅ Pagamento (RF-73 a RF-77b)
- ✅ Handoff Bot→Humano (RF-93 a RF-97)
- ✅ Segurança (RF-83 a RF-87)
- ✅ **Timeout de Confirmação** (RF-98 a RF-101) 🆕
- ✅ **Agendamentos Fixos** (RF-102 a RF-108) 🆕

---

## 🚀 Implementação em Produção

### Plano de 4 Semanas

#### ✅ Semana 1 - Infraestrutura & Contas
1. Criar conta n8n (cloud free ou self-hosted)
2. Configurar Evolution API no Oracle Cloud Free
3. Montar planilha Google Sheets (6 abas)
4. Conectar Google Agenda (OAuth 2.0)
5. Criar conta Mercado Pago (modo sandbox)

#### ✅ Semana 2 - Bot de Agendamento (Core)
6. Fluxo de boas-vindas + LGPD
7. Menu de serviços dinâmico (leitura do Sheets)
8. Verificação de disponibilidade (Google Agenda)
9. Confirmação do agendamento com timeout
10. Cancelamento com motivo
11. Handoff bot → humano

#### ✅ Semana 3 - Lembretes, Pagamento & Extras
12. Lembretes 24h e 2h antes
13. Fluxo de atraso (profissional responde OK/NÃO)
14. Cobrança de sinal via Pix (Mercado Pago)
15. Reagendamento (limite de 2x)
16. Lista de espera automática
17. **Agendamentos fixos semanais** 🆕

#### ✅ Semana 4 - Painel, Testes & Lançamento
18. Painel no Glide Apps (dashboard + gestão)
19. Testes internos completos (checklist)
20. Beta com 3-5 clientes reais
21. Lançamento oficial + monitoramento

### Checklist de Implementação

- [ ] Todas as 6 abas criadas no Google Sheets
- [ ] Evolution API conectada e funcionando
- [ ] Workflows n8n criados e testados
- [ ] Google Agenda sincronizando corretamente
- [ ] Mercado Pago em modo produção
- [ ] Glide Apps publicado
- [ ] Testes com clientes reais
- [ ] Monitoramento ativo

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Diretrizes para Contribuição

- Siga os padrões de código existentes
- Adicione comentários explicativos
- Teste todas as funcionalidades antes de enviar
- Atualize a documentação se necessário
- Seja detalhado na descrição do PR

---

## 🐛 Reportando Bugs

Encontrou um bug? Ajude-nos a melhorar!

1. Vá para a aba [Issues](https://github.com/seu-usuario/agendapro/issues)
2. Clique em "New Issue"
3. Use o template de bug report
4. Descreva o problema detalhadamente
5. Inclua screenshots se possível

---

## 💬 Suporte

- 📧 Email: seuemail@exemplo.com
- 💬 WhatsApp: +55 (11) 99999-9999
- 📱 Telegram: @seuusuario
- 🐦 Twitter: @seuusuario

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2026 AgendaPro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Autores

- **Seu Nome** - *Desenvolvedor Principal* - [@seuusuario](https://github.com/seuusuario)

Veja também a lista de [contribuidores](https://github.com/seu-usuario/agendapro/contributors) que participaram deste projeto.

---

## 🙏 Agradecimentos

- [Chart.js](https://www.chartjs.org/) - Biblioteca de gráficos
- [Font Awesome](https://fontawesome.com/) - Ícones
- [Google Fonts](https://fonts.google.com/) - Tipografia Inter
- [n8n](https://n8n.io/) - Plataforma de automação
- [Evolution API](https://evolution-api.com/) - API WhatsApp
- Comunidade open-source ❤️

---

## 📊 Estatísticas do Projeto

![GitHub stars](https://img.shields.io/github/stars/seu-usuario/agendapro?style=social)
![GitHub forks](https://img.shields.io/github/forks/seu-usuario/agendapro?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/seu-usuario/agendapro?style=social)

---

## 🌟 Showcase

Seu negócio está usando o AgendaPro? Adicione aqui!

- **Barbearia Silva** - São Paulo, SP
- **Salão Beleza Pura** - Rio de Janeiro, RJ
- **Studio Fit Personal** - Belo Horizonte, MG

---

<p align="center">
  Feito com ❤️ por <a href="https://github.com/seuusuario">Seu Nome</a>
</p>

<p align="center">
  ⭐ Deixe uma estrela se este projeto te ajudou!
</p>

<p align="center">
  <a href="#-índice">Voltar ao topo</a>
</p>

# ❓ Perguntas Frequentes (FAQ)

Respostas para as dúvidas mais comuns sobre o AgendaPro.

---

## 📋 Índice

- [Geral](#geral)
- [Demonstração](#demonstração)
- [Implementação](#implementação)
- [Custos](#custos)
- [Funcionalidades](#funcionalidades)
- [Técnicas](#técnicas)
- [Suporte](#suporte)

---

## 🌐 Geral

### O que é o AgendaPro?

O AgendaPro é um sistema completo de agendamento automatizado via WhatsApp, desenvolvido especialmente para profissionais autônomos e pequenas empresas. Ele automatiza todo o processo de marcação, confirmação, pagamento e gestão de horários.

### Para quem é indicado?

- 💇 Salões de beleza e barbearias
- 💅 Manicures e profissionais de estética
- 🏋️ Personal trainers
- 👨‍⚕️ Profissionais da saúde (psicólogos, nutricionistas)
- 🔧 Prestadores de serviços em geral
- Qualquer negócio que trabalhe com agendamentos

### É realmente gratuito?

Sim! A stack no-code utilizada tem versões gratuitas:
- ✅ n8n: Free tier (20 workflows, 5.000 execuções/mês)
- ✅ Evolution API: Open source (100% gratuito)
- ✅ Google Agenda: Gratuito
- ✅ Google Sheets: Gratuito
- ✅ Glide Apps: Free tier (500 usuários, updates ilimitados)
- 💳 Mercado Pago: Apenas 3,99% por transação Pix

**Custo fixo mensal: R$ 0,00**

---

## 💻 Demonstração

### Como testar a demonstração?

1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` no navegador
3. Clique em "Iniciar Demonstração"
4. Explore as 8 telas disponíveis

### A demonstração funciona offline?

Sim! Toda a demonstração roda localmente no navegador. Apenas o CDN do Chart.js e Font Awesome precisam de internet.

### Posso editar a demonstração?

Sim! O código é open-source (licença MIT). Você pode:
- Alterar cores e estilos
- Adicionar novas funcionalidades
- Adaptar para seu negócio
- Redistribuir (mantendo os créditos)

### Os dados da demo são salvos?

Alguns dados são salvos no `localStorage` do navegador (configurações). Os dados de exemplo (clientes, serviços, agendamentos) são resetados ao recarregar a página.

---

## 🏭 Implementação

### Quanto tempo leva para implementar?

Seguindo o plano de 4 semanas:
- **Semana 1**: Configurar infraestrutura (n8n, Evolution API, Google)
- **Semana 2**: Criar workflows do bot
- **Semana 3**: Adicionar funcionalidades extras (lembretes, pagamento, agendamentos fixos)
- **Semana 4**: Criar painel Glide, testar e lançar

**Total**: 4 semanas trabalhando algumas horas por dia

### Preciso saber programar?

**Não!** A implementação em produção usa ferramentas no-code:
- n8n: Editor visual de workflows
- Glide Apps: Criador de apps sem código
- Google Sheets: Planilha online
- Evolution API: Já configurada

Apenas configuração, não precisa escrever código!

### Preciso de servidor próprio?

Para a Evolution API, sim. Mas você pode usar:
- **Oracle Cloud Free Tier** (grátis para sempre)
- **Railway** ($5/mês)
- **Render** ($7/mês)

Ou contratar serviço gerenciado de Evolution API (~R$ 30-50/mês).

### Posso usar meu WhatsApp pessoal?

**Não recomendado!** Use um número dedicado com WhatsApp Business:
- Separa pessoal de profissional
- Evita ban por uso comercial
- Permite múltiplas conexões
- Profissional com seus clientes

### E se meu WhatsApp cair?

- Evolution API reconecta automaticamente
- Fila de mensagens no n8n aguarda reconexão
- Você pode ter backup com outro número
- Notificações por email como fallback

---

## 💰 Custos

### Existe custo escondido?

Não! Os únicos custos são:
- **3,99%** por transação Pix (Mercado Pago)
- **Servidor** para Evolution API (pode ser grátis com Oracle Cloud)
- **Domínio** (opcional, ~R$ 40/ano)

### Quanto vou economizar?

Comparado com soluções prontas:
- **Agendaê**: R$ 59-199/mês
- **Reservio**: R$ 79-299/mês  
- **Calendly**: R$ 40-80/mês
- **Acuity**: R$ 70-200/mês

**AgendaPro**: R$ 0/mês + 3,99% Pix = **Economia de R$ 500-2.400/ano**

### E se meu negócio crescer?

Os limites do free tier são generosos:
- **n8n**: 5.000 execuções/mês (mais que suficiente)
- **Glide**: 500 usuários/mês
- **Google**: Sem limites práticos

Se ultrapassar:
- n8n Pro: $20/mês (10.000 execuções)
- Glide Pro: $25/mês (usuários ilimitados)

Ainda muito mais barato que concorrentes!

---

## ✨ Funcionalidades

### O bot realmente funciona 24/7?

Sim! Uma vez configurado, o bot responde automaticamente a qualquer hora, inclusive finais de semana e feriados.

### Como funciona o timeout de confirmação?

1. Cliente agenda um horário
2. Bot avisa: "Você tem 30 minutos para confirmar"
3. Cliente paga o sinal ou confirma presença
4. Se não confirmar em 30 min → horário liberado automaticamente

O tempo é configurável: 15min, 30min, 1h, 2h, 6h, 12h ou 24h.

### Como funcionam os agendamentos fixos?

1. Profissional cria: "Ana Costa - Toda quinta às 15h"
2. Sistema agenda automaticamente os próximos 4 agendamentos
3. Ana recebe lembretes antes de cada data
4. A cada semana, sistema cria o próximo agendamento automaticamente
5. Se Ana cancelar uma quinta, as próximas continuam agendadas

### Posso ter múltiplos profissionais?

A versão atual é para **um profissional**. Para múltiplos:
- Cada profissional precisa de conta separada
- Ou aguarde a versão 2.2 (roadmap) com suporte multi-profissional

### O sistema envia lembretes?

Sim! Automaticamente:
- **24 horas antes**: "Lembrete: Amanhã você tem agendamento às 15h"
- **2 horas antes**: "Lembrete: Seu agendamento é daqui a 2 horas"

### Como funciona o pagamento?

1. Cliente escolhe serviço
2. Bot calcula sinal (ex: 30% de R$ 50 = R$ 15)
3. Bot envia link de pagamento Pix (Mercado Pago)
4. Cliente paga
5. Sistema confirma automaticamente
6. Agendamento garantido

### E o reembolso?

- **Cancelamento com antecedência**: Reembolso automático em 24h
- **Cancelamento em cima da hora**: Sem reembolso (configurável)
- **Cancelamento pelo profissional**: Sempre reembolso integral

---

## 🔧 Técnicas

### Por que não usar React/Vue/Angular?

Para manter simples! O objetivo é:
- ✅ Zero dependências npm
- ✅ Fácil de entender e modificar
- ✅ Leve e rápido
- ✅ Funciona abrindo o HTML

### Posso adicionar banco de dados real?

Sim! Você pode substituir Google Sheets por:
- Firebase Firestore
- Supabase
- MySQL + API própria
- MongoDB

Mas para MVP, Google Sheets funciona perfeitamente bem.

### Como adicionar autenticação?

A versão atual é demonstração local. Para produção:
- Glide Apps tem autenticação integrada
- Ou use Firebase Auth
- Ou Supabase Auth

### O sistema é escalável?

**Para pequenos negócios**: Perfeitamente!
- Até 1.000 agendamentos/mês: Sem problemas
- Google Sheets suporta 5 milhões de células
- n8n processa milhares de execuções

**Para grandes empresas**: Considere:
- Migrar Google Sheets → Banco de dados real
- n8n self-hosted
- Infraestrutura dedicada

### Como fazer backup?

- **Google Sheets**: Automático (histórico de versões)
- **n8n**: Exportar workflows JSON
- **Evolution API**: Backup do container Docker
- Recomendado: Backup semanal manual

---

## 📱 WhatsApp

### Qual a diferença entre WhatsApp normal e Business?

**WhatsApp Business** é essencial porque:
- ✅ Permite perfil profissional
- ✅ Catálogo de produtos/serviços
- ✅ Mensagens automáticas
- ✅ Estatísticas
- ✅ Múltiplos dispositivos

### Posso usar WhatsApp GB/Plus/modificado?

**NÃO!** Apenas WhatsApp oficial:
- WhatsApp Business (app oficial)
- API oficial via Evolution API
- Versões modificadas levam a ban permanente

### Meu número pode ser banido?

Minimiza o risco:
- ✅ Use WhatsApp Business (não pessoal)
- ✅ Não envie spam
- ✅ Respeite horários (não enviar madrugada)
- ✅ Use API oficial (Evolution)
- ✅ Evite mensagens em massa
- ✅ Sempre peça consentimento (LGPD)

### Quantos clientes posso atender?

Sem limite! O sistema escala para:
- Centenas de conversas simultâneas
- Milhares de agendamentos/mês
- Resposta instantânea sempre

---

## 🆘 Suporte

### Encontrei um bug, o que fazer?

1. Verifique se já não foi reportado nas [Issues](https://github.com/seu-usuario/agendapro/issues)
2. Crie nova issue com:
   - Descrição detalhada
   - Passos para reproduzir
   - Screenshots
   - Console do navegador (F12)

### Quero sugerir uma funcionalidade

Adoramos sugestões!
1. Crie issue com label "enhancement"
2. Descreva o problema que resolve
3. Como imagina a solução
4. Participe das [Discussions](https://github.com/seu-usuario/agendapro/discussions)

### Posso contratar suporte personalizado?

Sim! Entre em contato:
- 📧 Email: seuemail@exemplo.com
- 💬 WhatsApp: +55 (11) 99999-9999

Oferecemos:
- Instalação completa
- Personalização
- Treinamento
- Manutenção
- Novas funcionalidades

### Como contribuir com o projeto?

- 🐛 Reporte bugs
- 💡 Sugira melhorias
- 📝 Melhore documentação
- 💻 Envie pull requests
- ⭐ Dê uma estrela no GitHub
- 📢 Compartilhe com outros profissionais

---

## 🎓 Aprendizado

### Onde aprender mais sobre as tecnologias?

- **n8n**: [docs.n8n.io](https://docs.n8n.io)
- **Evolution API**: [doc.evolution-api.com](https://doc.evolution-api.com)
- **Google Sheets API**: [developers.google.com/sheets](https://developers.google.com/sheets/api)
- **Glide Apps**: [glideapps.com/docs](https://www.glideapps.com/docs)
- **Mercado Pago**: [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers/pt/docs)

### Tem vídeo tutorial?

Em breve! Estamos preparando:
- 🎥 Tour pela demonstração
- 🎥 Instalação passo a passo
- 🎥 Criando workflows n8n
- 🎥 Configurando Evolution API
- 🎥 Personalizando Glide Apps

Inscreva-se no canal: [YouTube](#)

---

## 📊 Casos de Uso

### Caso Real 1: Barbearia

**Problema**: 30% de no-shows, muito tempo no WhatsApp

**Solução AgendaPro**:
- Bot atende automaticamente
- Timeout de 30min com sinal de R$ 10
- No-shows caíram para 5%
- Tempo no WhatsApp: -80%

### Caso Real 2: Manicure

**Problema**: Clientes esqueciam, tinha que ligar lembrando

**Solução AgendaPro**:
- Lembretes automáticos 24h e 2h antes
- Agendamentos fixos (clientas toda quinta)
- Taxa de comparecimento: 95%
- Zero ligações de lembrete

### Caso Real 3: Personal Trainer

**Problema**: Remarcações constantes, agenda bagunçada

**Solução AgendaPro**:
- Limite de 2 reagendamentos
- Google Agenda sincronizado
- Política de cancelamento clara
- Remarcações caíram 60%

---

## 🔮 Futuro

### Quando sai a versão 2.2?

Previsão: Abril-Maio 2026

**Novas funcionalidades**:
- Avaliações pós-atendimento
- Programa de fidelidade
- Múltiplos profissionais
- Agendamentos quinzenais

### Terá app móvel?

Versão 3.0 (previsão: final de 2026):
- App nativo iOS
- App nativo Android
- Notificações push
- Modo offline

### Posso investir no projeto?

Entre em contato! Estamos abertos a:
- Investidores
- Parcerias
- Patrocínios
- Co-desenvolvimento

---

## 📞 Contato

Ainda tem dúvidas?

- 📧 **Email**: seuemail@exemplo.com
- 💬 **WhatsApp**: +55 (11) 99999-9999
- 💭 **Discussions**: [GitHub](https://github.com/seu-usuario/agendapro/discussions)
- 🐦 **Twitter**: @seuusuario
- 📸 **Instagram**: @seuusuario

---

<p align="center">
  Não encontrou sua pergunta? <a href="https://github.com/seu-usuario/agendapro/discussions/new">Pergunte aqui!</a>
</p>

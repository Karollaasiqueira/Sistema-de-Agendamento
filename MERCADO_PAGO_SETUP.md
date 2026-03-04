# Mercado Pago Setup Guide

## Overview
Mercado Pago é a plataforma de pagamentos que integra com AgendaPro para processar Pix e cartão.

## Passo 1: Criar Conta Mercado Pago

1. Acesse: https://www.mercadopago.com.br
2. Clique em "Criar conta"
3. Preencha dados:
   - Email
   - Senha forte
   - Telefone
4. Confirme email
5. Preencha dados pessoais (CPF, data nascimento)

## Passo 2: Acessar Modo Sandbox (Testes)

1. Após criar conta, acesse: https://www.mercadopago.com.br/developers/pt/reference
2. No menu, vá para: **Seu Negócio** → **Credenciais**
3. Selecione: **Modo de Teste**
4. Você verá:
   - **Public Key** (começa com: `APP_USR_...`)
   - **Access Token** (começa com: `APP_USR_...`)

## Passo 3: Copiar Credenciais

```bash
# Salve em um arquivo seguro:
MERCADO_PAGO_PUBLIC_KEY=APP_USR_sua_chave_publica_aqui
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_seu_access_token_aqui
```

## Passo 4: Criar Preference (Configuração de Pagamento)

Via API ou Dashboard:

```bash
curl -X POST https://api.mercadopago.com/checkout/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer APP_USR_seu_access_token_aqui" \
  -d '{
    "items": [
      {
        "title": "Agendamento - Corte de Cabelo",
        "quantity": 1,
        "unit_price": 50.00
      }
    ],
    "back_urls": {
      "success": "https://seu-dominio.com/sucesso",
      "failure": "https://seu-dominio.com/falha",
      "pending": "https://seu-dominio.com/pendente"
    },
    "notification_url": "https://seu-dominio.com/webhook/mercado-pago"
  }'
```

## Passo 5: Configurar Webhook

No Dashboard Mercado Pago:

1. Vá para: **Seu Negócio** → **Webhooks**
2. Clique em **Adicionar novo webhook**
3. URL: `https://seu-n8n.com/webhook/mercado-pago`
4. Eventos: Selecione `payment.created` e `payment.updated`
5. Salve

## Passo 6: Testar Pagamento

### Cartão de Teste (Sandbox)
```
Número: 4111111111111111
Vencimento: 11/25
CVV: 123
```

### Resultado esperado
- Status: `approved`
- Transaction ID retornado

## Passo 7: Integrar com n8n

No workflow n8n:

1. Adicionar node "HTTP Request"
2. Method: POST
3. URL: `https://api.mercadopago.com/checkout/preferences`
4. Headers:
   ```
   Authorization: Bearer APP_USR_seu_access_token_aqui
   Content-Type: application/json
   ```
5. Body:
   ```json
   {
     "items": [
       {
         "title": "{{ $node[\"Sheets\"].json.servico }}",
         "quantity": 1,
         "unit_price": {{ $node[\"Sheets\"].json.valor }}
       }
     ],
     "notification_url": "https://seu-n8n.com/webhook/mp"
   }
   ```

## Passo 8: Salvar Credenciais no n8n

1. No n8n, vá para **Credentials**
2. Crie nova credencial "HTTP Basic Auth" com:
   - Username: `blank`
   - Password: `APP_USR_seu_access_token_aqui`
3. Use no node HTTP

## Transição para Produção

Quando pronto para produção:

1. No Mercado Pago: **Seu Negócio** → **Credenciais** → Modo **PRODUÇÃO**
2. Copiar credenciais de produção (diferentes!)
3. Atualizar em `.env` e n8n
4. Testar com pagamento real pequeno
5. Monitorar webhooks

## Troubleshooting

### Webhook não recebe dados
- Verificar URL está correta
- Verificar logs do n8n
- Testar URL em: https://webhook.site

### Transação rejeitada
- Verificar credenciais
- Verificar dados do cliente
- Verificar limite da conta

### Erro 401 Unauthorized
- Access Token inválido ou expirado
- Copiar novamente das credenciais

## Próximo Passo
Configurar webhook receptor no n8n para processar pagamentos.

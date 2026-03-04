# Evolution API Setup Guide

## Overview
Evolution API é um servidor WhatsApp oficial que permite integração com n8n e outros sistemas.

## Pré-requisitos
- VPS/Servidor (Oracle Cloud Free ou DigitalOcean)
- Docker instalado
- Acesso SSH ao servidor
- WhatsApp Business Account

## Passo 1: Criar VPS

### Oracle Cloud Free (RECOMENDADO - 100% GRÁTIS)
1. Acesse: https://www.oracle.com/cloud/free/
2. Crie conta
3. Crie VM: Ubuntu 22.04 (sempre grátis)
4. Copie IP público
5. Baixe chave privada (.key)

### DigitalOcean (Alternativa - $5-6/mês)
1. Acesse: https://www.digitalocean.com
2. Crie conta
3. Crie Droplet: Ubuntu 22.04
4. Copie IP público

## Passo 2: Conectar SSH

### Windows (PowerShell)
```powershell
# Mude permissões da chave
icacls "C:\caminho\chave.key" /inheritance:r /grant:r "%username%:(F)"

# Connect
ssh -i "C:\caminho\chave.key" ubuntu@SEU_IP_PUBLICO
```

### Mac/Linux
```bash
chmod 600 ~/Downloads/chave.key
ssh -i ~/Downloads/chave.key ubuntu@SEU_IP_PUBLICO
```

## Passo 3: Instalar Docker

No servidor (após SSH):

```bash
# Update
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Verify
docker --version
```

## Passo 4: Deploy Evolution API

```bash
# Create directory
mkdir -p ~/evolution-api && cd ~/evolution-api

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  evolution:
    image: atendai/evolution-api:latest
    container_name: evolution-api
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=http://SEU_IP_PUBLICO:3000
      - API_KEY=sua_chave_api_segura_aqui
      - DATABASE_URL=sqlite:///app/database.db
    volumes:
      - ./instances:/home/evolution/instances
      - ./database:/home/evolution/database
    networks:
      - evolution-network

networks:
  evolution-network:
    driver: bridge
EOF

# Start Evolution
docker-compose up -d

# Check logs
docker-compose logs -f evolution
```

## Passo 5: Verificar Health Check

```bash
# No seu computador (Windows/Mac)
curl http://SEU_IP_PUBLICO:3000/api/health

# Deve retornar:
# {"status":"ok","message":"Evolution API is running"}
```

## Passo 6: Configurar WhatsApp Business

### No Portal Evolution API (http://SEU_IP_PUBLICO:3000)

1. **Criar nova instância:**
   - Nome: `agendapro`
   - Clicar em "Create Instance"

2. **Escanear QR Code:**
   - Abrir WhatsApp no celular
   - Configurações → Aparelhos Conectados → Conectar Novo
   - Escanear QR gerado pelo Evolution

3. **Copiar dados da instância:**
   - Instance Name: `agendapro`
   - API Key: `sua_chave_api_segura_aqui`
   - Webhook URL: `https://n8n-seu-dominio.com/webhook/evolution`

## Troubleshooting

### Container não inicia
```bash
docker-compose logs evolution
# Ver erro específico
```

### Porta 3000 já em uso
```bash
# Mudar para porta diferente em docker-compose.yml
# ports:
#   - "3001:3000"
```

### WhatsApp desconecta
- Manter celular ligado
- Não abrir WhatsApp oficial
- Verificar conexão internet

## Próximo Passo
Configurar webhook no n8n para receber mensagens do Evolution.

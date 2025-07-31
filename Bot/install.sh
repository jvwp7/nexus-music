#!/bin/bash

# Limpar cache do npm
npm cache clean --force

# Instalar dependências com flags especiais
npm install --legacy-peer-deps --force --no-audit --no-fund

# Verificar se a instalação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "✅ Instalação concluída com sucesso!"
else
    echo "❌ Erro na instalação"
    exit 1
fi 
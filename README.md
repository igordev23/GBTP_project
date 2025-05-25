# Gabio Bank - GBTP Protocol

## Descrição Geral
Este projeto simula um sistema bancário simples utilizando um protocolo textual chamado GBTP (Gabio Bank Transaction Protocol), inspirado no CNET.

### Estrutura do Projeto
- **/gabio-client**: Cliente web feito em HTML + TypeScript, que se comunica com o servidor via WebSocket.
- **/gabio-server**: Servidor feito com Node.js + TypeScript que processa requisições GBTP.
- **README.md**: Este arquivo com as informações do projeto e do protocolo.

## Protocolo GBTP

### Formato de Requisição
- **OPERATION**: BALANCE, DEPOSIT, WITHDRAW, TRANSFER
- **ACCOUNT_ID**: ID da conta principal
- **TO_ACCOUNT_ID**: ID da conta de destino (para TRANSFER, vazio caso contrário)
- **VALUE**: Valor da transação (para BALANCE pode ser 0)

### Formato de Resposta
- **STATUS**: OK ou ERROR
- **MESSAGE**: Descrição do resultado
- **BALANCE**: Saldo atual da conta

## Inicialização do Servidor
O servidor cria automaticamente contas fictícias: 1001, 1002 e 1003 com saldos iniciais.

## Requisitos
- Node.js instalado
- Compilar TypeScript no client e server
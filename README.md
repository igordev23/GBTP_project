
# Gabio Bank - GBTP Protocol

## 📑 Descrição Geral
Gabio Bank é um sistema bancário simples que simula operações financeiras utilizando um protocolo textual chamado **GBTP (Gabio Bank Transaction Protocol)**, inspirado no protocolo CNET. O sistema permite que clientes interajam com um servidor bancário via WebSocket.

## 🗂️ Estrutura do Projeto
```
/
├── gabio-client   # Cliente web (HTML + TypeScript + Parcel)
├── gabio-server   # Servidor Node.js + TypeScript (WebSocket)
└── README.md      # Documentação do projeto
```

## 🔌 Protocolo GBTP

### Formato de Requisição
Cada requisição enviada do cliente para o servidor segue o formato textual abaixo, com campos separados por quebras de linha (`\n`):

```
OPERATION:<BALANCE|DEPOSIT|WITHDRAW|TRANSFER>
ACCOUNT_ID:<ID da conta de origem>
TO_ACCOUNT_ID:<ID da conta de destino> (somente para TRANSFER, vazio nos demais)
VALUE:<Valor da operação> (0 para BALANCE)
```

### Exemplo de Requisições
- Consultar saldo:
```
OPERATION:BALANCE
ACCOUNT_ID:1001
TO_ACCOUNT_ID:
VALUE:0
```

- Depósito:
```
OPERATION:DEPOSIT
ACCOUNT_ID:1001
TO_ACCOUNT_ID:
VALUE:150
```

- Saque:
```
OPERATION:WITHDRAW
ACCOUNT_ID:1002
TO_ACCOUNT_ID:
VALUE:100
```

- Transferência:
```
OPERATION:TRANSFER
ACCOUNT_ID:1001
TO_ACCOUNT_ID:1002
VALUE:200
```

### Formato de Resposta
O servidor responde no formato:

```
STATUS:<OK|ERROR>
MESSAGE:<Mensagem de retorno>
BALANCE:<Saldo atual da conta>
```

### Exemplo de Resposta
```
STATUS:OK
MESSAGE:Depósito realizado com sucesso
BALANCE:650.00
```

## 🏦 Contas Simuladas
O servidor inicia automaticamente com as seguintes contas fictícias:

| Conta | Saldo Inicial |
|-------|----------------|
| 1001  | 500.00         |
| 1002  | 300.00         |
| 1003  | 700.00         |

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** instalado (v18 ou superior recomendado)
- **Parcel** para o cliente web
- **TypeScript** configurado

### 🔧 Executando o Servidor
1. Navegue até a pasta `gabio-server`:
   ```bash
   cd gabio-server
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Compile o código TypeScript:
   ```bash
   npm run build
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

Servidor rodará por padrão em `ws://localhost:8080`.

### 🖥️ Executando o Cliente Web
1. Navegue até a pasta `gabio-client`:
   ```bash
   cd gabio-client
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Rode o projeto com Parcel:
   ```bash
   npm run start
   ```

4. Acesse o cliente no navegador através do endereço:
   ```
   http://localhost:1234
   ```

## 📦 Scripts Disponíveis

### No Client (`gabio-client`)
- `npm run start` — Inicia o servidor de desenvolvimento Parcel.
- `npm run build` — Gera o build otimizado.

### No Server (`gabio-server`)
- `npm run build` — Compila TypeScript.
- `npm start` — Executa o servidor compilado.

## 📄 Estrutura dos Arquivos

### Client
- HTML + TypeScript
- Interface para escolher operação (Balance, Deposit, Withdraw, Transfer)
- Comunicação WebSocket
- Feedback dinâmico ao usuário

### Server
- WebSocket Server (porta 8080)
- Processamento das operações bancárias
- Arquivo `accounts.json` opcional (para simular persistência)

## ⚙️ Tecnologias Usadas
- Node.js
- TypeScript
- WebSocket (`ws`)
- Parcel (no client)


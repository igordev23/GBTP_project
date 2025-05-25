import { WebSocketServer } from "ws";

// Banco de dados simulado
const accounts: Record<string, number> = {
    "1001": 500.00,
    "1002": 300.00,
    "1003": 700.00
};

// Inicia servidor WebSocket
const wss = new WebSocketServer({ port: 8080 });
console.log("Servidor WebSocket rodando na porta 8080");

// Conexão de cliente
wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const message = data.toString();
        const response = handleRequest(message);

        ws.send(response);
    });
});

/** ===============================
 * Processamento da requisição
 * =================================*/
function handleRequest(rawMessage: string): string {
    const data = parseMessage(rawMessage);

    const operation = data["OPERATION"];
    const accountId = data["ACCOUNT_ID"];
    const toAccountId = data["TO_ACCOUNT_ID"];
    const value = parseFloat(data["VALUE"]) || 0;

    if (!validateBasic(operation, accountId, value)) {
        return errorResponse("Dados inválidos", accountId);
    }

    switch (operation) {
        case "BALANCE":
            return handleBalance(accountId);
        case "DEPOSIT":
            return handleDeposit(accountId, value);
        case "WITHDRAW":
            return handleWithdraw(accountId, value);
        case "TRANSFER":
            return handleTransfer(accountId, toAccountId, value);
        default:
            return errorResponse("Operação inválida", accountId);
    }
}

/** ===============================
 * Manipuladores de operações
 * =================================*/

function handleBalance(accountId: string): string {
    return successResponse("Saldo consultado com sucesso", accountId);
}

function handleDeposit(accountId: string, value: number): string {
    accounts[accountId] += value;
    return successResponse("Depósito realizado com sucesso", accountId);
}

function handleWithdraw(accountId: string, value: number): string {
    if (accounts[accountId] >= value) {
        accounts[accountId] -= value;
        return successResponse("Saque realizado com sucesso", accountId);
    }
    return errorResponse("Saldo insuficiente", accountId);
}

function handleTransfer(fromAccount: string, toAccount: string, value: number): string {
    if (!toAccount) {
        return errorResponse("Conta de destino não informada", fromAccount);
    }
    if (fromAccount === toAccount) {
        return errorResponse("Conta de origem igual à de destino", fromAccount);
    }
    if (!accounts[toAccount]) {
        return errorResponse("Conta de destino inexistente", fromAccount);
    }
    if (accounts[fromAccount] < value) {
        return errorResponse("Saldo insuficiente para transferência", fromAccount);
    }

    accounts[fromAccount] -= value;
    accounts[toAccount] += value;

    return successResponse("Transferência realizada com sucesso", fromAccount);
}

/** ===============================
 * Helpers de resposta
 * =================================*/

function successResponse(message: string, accountId: string): string {
    return `STATUS:OK\nMESSAGE:${message}\nBALANCE:${accounts[accountId].toFixed(2)}`;
}

function errorResponse(message: string, accountId: string): string {
    const balance = accounts[accountId] !== undefined ? accounts[accountId].toFixed(2) : "0.00";
    return `STATUS:ERROR\nMESSAGE:${message}\nBALANCE:${balance}`;
}

/** ===============================
 * Funções auxiliares
 * =================================*/

function parseMessage(msg: string): Record<string, string> {
    const lines = msg.trim().split("\n");
    const data: Record<string, string> = {};

    lines.forEach(line => {
        const [key, ...rest] = line.split(":");
        data[key.trim().toUpperCase()] = rest.join(":").trim();
    });

    return data;
}

function validateBasic(
  operation?: string, 
  accountId?: string, 
  value?: number
): boolean {
  const hasOperation = Boolean(operation);
  const hasAccount = Boolean(accountId);
  const isValidValue = value !== undefined && value >= 0;
  const accountExists = accountId !== undefined && accountId in accounts;

  return hasOperation && hasAccount && isValidValue && accountExists;
}

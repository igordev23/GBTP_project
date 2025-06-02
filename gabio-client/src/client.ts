const socket : WebSocket = new WebSocket("ws://localhost:8080");

const statusEl = document.getElementById("status")!;
const responseEl = document.getElementById("response")!;

const operationEl = document.getElementById("operation") as HTMLSelectElement;
const toAccountContainer = document.getElementById("toAccountContainer")!;
const valueContainer = document.getElementById("valueContainer")!;

function updateFieldVisibility() {
    const operation = operationEl.value;

    // Mostrar apenas para TRANSFER
    toAccountContainer.style.display = operation === "TRANSFER" ? "block" : "none";

    // Mostrar value para operações que usam valor
    const needsValue = ["DEPOSIT", "WITHDRAW", "TRANSFER"].includes(operation);
    valueContainer.style.display = needsValue ? "block" : "none";
}

// Atualizar ao carregar a página
updateFieldVisibility();

// Atualizar sempre que mudar a operação
operationEl.addEventListener("change", updateFieldVisibility);


socket.addEventListener("open", () => {
    statusEl.innerText = "Status: Banco Online";
});
socket.addEventListener("open", () => {
    console.log("Status: Conectado ao servidor") ;
});

socket.addEventListener("close", () => {
    statusEl.innerText = "Status: Banco Offline";
});
socket.addEventListener("close", () => {
   console.log("Status: Desconectado do servidor");
});

socket.addEventListener("message", (event) => {
    const lines = (event.data as string).split('\n');
    let message = "";
    let balance = "";

    for (const line of lines) {
        if (line.startsWith("MESSAGE:")) {
            message = line.replace("MESSAGE:", "").trim();
        } else if (line.startsWith("BALANCE:")) {
            balance = line.replace("BALANCE:", "").trim();
        }
    }

    // Montar a resposta completa
    let response = "";

    if (message) {
        response += message + "\n";
    }
    if (balance) {
        response += `SALDO: ${balance}`;
    }

    if (!response) {
        response = "Resposta não reconhecida.";
    }

    responseEl.textContent = response;
});




socket.addEventListener("message", (event) => {
     console.log(event.data);
});

document.getElementById("send")!.addEventListener("click", () => {
    const operation = (document.getElementById("operation") as HTMLSelectElement).value;
    const accountId = (document.getElementById("accountId") as HTMLInputElement).value.trim();
    const toAccountId = (document.getElementById("toAccountId") as HTMLInputElement).value.trim();
    const value = (document.getElementById("value") as HTMLInputElement).value.trim();

    if (!accountId) {
        alert("Por favor, preencha o Account ID.");
        return;
    }

    const request = 
`OPERATION:${operation}
ACCOUNT_ID:${accountId}
TO_ACCOUNT_ID:${operation === 'TRANSFER' ? toAccountId : ''}
VALUE:${value || '0'}`;

    socket.send(request);
});


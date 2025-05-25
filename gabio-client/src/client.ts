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
    statusEl.innerText = "Status: Conectado ao servidor";
});

socket.addEventListener("close", () => {
    statusEl.innerText = "Status: Desconectado";
});

socket.addEventListener("message", (event) => {
    responseEl.textContent = event.data;
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

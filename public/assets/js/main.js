let sendButton = document.querySelector("#sendButton");
const messagesContainer = document.querySelector(".chat__messages");

sendButton.addEventListener("click", async () => {
    let inputText = document.querySelector("#inputText");
    const text = inputText.value.trim();
    const targetSpeaker = document.querySelector("#targetSpeaker").value;

    if (!text) return false;

    // Mostrar mensaje del usuario en el chat
    const userMessage = document.createElement("div");
    userMessage.className = "chat__message chat__message--user";
    userMessage.textContent = text;
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Crear mensaje de "cargando..."
    const loading = document.createElement("div");
    loading.className = "chat__message chat__message--bot";
    loading.textContent = "Generando audio...";
    messagesContainer.appendChild(loading);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch("/api/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, speaker: targetSpeaker })
        });

        if (!response.ok) {
            console.error("Error del servidor:", await response.text());
            loading.textContent = "Error al generar el audio.";
            return;
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("audio")) {
            console.error("La respuesta no es un archivo de audio");
            loading.textContent = "Respuesta inválida del servidor.";
            console.log(await response.text());
            return;
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Reemplazar mensaje de cargando con el reproductor de audio
        loading.innerHTML = `
            <audio controls>
                <source src="${audioUrl}" type="audio/mpeg">
                Tu navegador no puede reproducir audios.
            </audio>
        `;

    } catch (error) {
        console.error("Error:", error);
        loading.textContent = "Error de conexión.";
    }

    inputText.value = "";
});

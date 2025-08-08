let sendButton = document.querySelector("#sendButton");

sendButton.addEventListener("click", async () => {
    let inputText = document.querySelector("#inputText");
    const text = inputText.value.trim();
    const targetSpeaker = document.querySelector("#targetSpeaker").value;

    if (!text) return false;

    // Mostrar mensaje del usuario en el chat
    const userMessage = document.createElement("div");
    userMessage.className = "chat__message chat__message--user";
    userMessage.textContent = text;

    const messagesContainer = document.querySelector(".chat__messages");
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch("/api/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, speaker: targetSpeaker })
        });

        // ✅ Verificar si la respuesta fue exitosa
        if (!response.ok) {
            console.error("Error del servidor:", await response.text());
            return;
        }

        // ✅ Verificar que el contenido sea audio
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("audio")) {
            console.error("La respuesta no es un archivo de audio");
            console.log(await response.text()); // Para depuración
            return;
        }

        // ✅ Crear blob y URL del audio
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Mensaje del bot con audio
        const botMessage = document.createElement("div");
        botMessage.className = "chat__message chat__message--bot";
        botMessage.innerHTML = `
            <audio controls>
                <source src="${audioUrl}" type="audio/mpeg">
                Tu navegador no puede reproducir audios
            </audio>
        `;

        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
        console.error("Error:", error);
    }

    inputText.value = "";
});

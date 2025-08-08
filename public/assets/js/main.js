let translateButton = document.querySelector("#translateButton");

translateButton.addEventListener("click", async () => {
    let inputText = document.querySelector("#inputText");
    const text = inputText.value.trim();
    const targetLang = document.querySelector("#targetLang").value;

    if (!text) return false;

    // Mostrar mensaje del usuario en el chat
    const userMessage = document.createElement("div");
    userMessage.className = "chat__message chat__message--user";
    userMessage.textContent = text;

    const messagesContainer = document.querySelector(".chat__messages");
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch("/api/traducir", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, targetLang })
        });

        const data = await response.json();

        // Mostrar traducción en el chat, no en alert
        const botMessage = document.createElement("div");
        botMessage.className = "chat__message chat__message--bot";
        botMessage.textContent = data.translatedText;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
        console.error("Error:", error);
    }

    inputText.value = "";
});

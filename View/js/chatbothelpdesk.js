
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const messagesContainer = document.getElementById('chat-messages');


const API_URL = 'https://aiarpesod.onrender.com/chatbot/ask-helpdesk' ;

chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user');
    chatInput.value = '';

    const thinkingMessage = addMessage('...', 'bot', true);

    try {
        // Simulación de respuesta de la API para demostración visual
        // Descomenta el bloque fetch para usar la API real
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: userMessage }),
        });

        if (!response.ok) throw new Error(`Error de la API: ${response.statusText}`);
        const data = await response.json();
        
        
        // Actualizar el mensaje de "pensando" con la respuesta real
        updateThinkingMessage(thinkingMessage, data.answer);


    } catch (error) {
        console.error('Error al contactar la API:', error);
        const errorMessage = 'Lo siento, he tenido un problema para conectarme. Por favor, revisa que la API esté corriendo y no haya errores de CORS.';
        // Actualizar el mensaje de "pensando" con el mensaje de error
        updateThinkingMessage(thinkingMessage, errorMessage);
    }
});

function addMessage(text, sender, isThinking = false) {
    const messageBlock = document.createElement('div');
    messageBlock.classList.add('message-block', sender);
    
    const avatar = document.createElement('div');
    avatar.classList.add('message-avatar');
    avatar.textContent = sender === 'user' ? 'TÚ' : 'IA';
    
    const content = document.createElement('div');
    content.classList.add('message-content');

    if (isThinking) {
        content.classList.add('thinking');
        content.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    } else {
        // Usamos textContent para evitar inyección de HTML
        content.textContent = text;
    }

    messageBlock.appendChild(avatar);
    messageBlock.appendChild(content);
    messagesContainer.appendChild(messageBlock);
    
    // Hacer scroll hacia el último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageBlock;
}

function updateThinkingMessage(thinkingMessageBlock, newText) {
    const content = thinkingMessageBlock.querySelector('.message-content');
    if(content) {
        content.classList.remove('thinking');
        content.innerHTML = ''; // Limpiar los puntos
        content.textContent = newText; // Añadir el nuevo texto de forma segura
    }
}
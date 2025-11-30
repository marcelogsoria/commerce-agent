const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const envInfo = document.getElementById('env-info');

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) {
        return;
    }

    // Create and append user message
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('message', 'user-message');
    userMessageElement.textContent = message;
    chatMessages.appendChild(userMessageElement);

    // Clear input and scroll to bottom
    messageInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Create and append agent message
        const agentMessageElement = document.createElement('div');
        agentMessageElement.classList.add('message', 'agent-message');
        agentMessageElement.textContent = data.response;
        chatMessages.appendChild(agentMessageElement);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        console.error('Error sending message:', error);
        const errorMessageElement = document.createElement('div');
        errorMessageElement.classList.add('message', 'agent-message');
        errorMessageElement.style.backgroundColor = '#ffcccb';
        errorMessageElement.textContent = 'Sorry, something went wrong.';
        chatMessages.appendChild(errorMessageElement);
    }
}

async function loadEnvInfo() {
    try {
        const response = await fetch('/env-info');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        envInfo.innerHTML = `
            <div>
                <h3>Commercetools</h3>
                <ul>
                    <li><strong>Project Key:</strong> ${data.commercetoolsProjectKey}</li>
                    <li><strong>Client ID:</strong> ${data.clientId}</li>
                </ul>
            </div>
            <div>
                <h3>Twilio</h3>
                <ul>
                    <li><strong>Number:</strong> ${data.twilioNumber}</li>
                    <li><strong>Account SID:</strong> ${data.accountSid}</li>
                </ul>
            </div>
            <div>
                <h3>Langchain</h3>
                <ul>
                    <li><strong>Core:</strong> ${data.langchain.core}</li>
                    <li><strong>Langgraph:</strong> ${data.langchain.langgraph}</li>
                    <li><strong>OpenAI:</strong> ${data.langchain.openai}</li>
                </ul>
            </div>
            <div>
                <h3>Node.js</h3>
                <ul>
                    <li><strong>Version:</strong> ${data.nodeVersion}</li>
                </ul>
            </div>
        `;
    } catch (error) {
        console.error('Error loading env info:', error);
        envInfo.innerHTML = '<p>Could not load environment information.</p>';
    }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

window.addEventListener('load', loadEnvInfo);

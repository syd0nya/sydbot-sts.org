const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const typingIndicator = document.getElementById('typing-indicator');

// OpenRouter API
const OPENROUTER_API_KEY = "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";

// Optional offline fallback responses
const offlineResponses = [
  { keywords: ["wifi", "internet", "connection"], reply: "Try restarting your router and check if other devices are connected." },
  { keywords: ["password", "login"], reply: "Use a strong password with numbers, symbols, and uppercase letters." },
  { keywords: ["website", "ssl"], reply: "Check your SSL certificate and ensure your DNS records are correct." },
  { keywords: ["slow", "lag", "performance"], reply: "Clear cache and restart your system. Also, check for updates." }
];

function getOfflineResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  for (const item of offlineResponses) {
    if (item.keywords.some(keyword => msg.includes(keyword))) {
      return item.reply;
    }
  }
  return "I'm not sure about that yet. Could you describe the issue differently?";
}

function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender === 'user' ? 'user-msg' : 'bot-msg');
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function getAIResponse(userMessage) {
  typingIndicator.style.display = "flex";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are SydBot, a friendly IT and cybersecurity assistant. Respond clearly and professionally." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    typingIndicator.style.display = "none";

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      return getOfflineResponse(userMessage);
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    typingIndicator.style.display = "none";
    return getOfflineResponse(userMessage);
  }
}

sendBtn.addEventListener('click', async () => {
  const userText = userInput.value.trim();
  if (!userText) return;

  addMessage('user', userText);
  userInput.value = '';

  const botReply = await getAIResponse(userText);
  addMessage('bot', botReply);
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

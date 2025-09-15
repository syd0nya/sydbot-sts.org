const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const responses = {
  "hello": "Hi! I’m SydBot. How can I help you with IT today?",
  "wifi": "Try restarting your router and checking your network settings.",
  "password": "Make sure your password is strong: use letters, numbers, and symbols.",
  "website": "Check your SSL certificate and plugin updates.",
};

sendBtn.addEventListener('click', () => {
  const userText = userInput.value.trim();
  if (!userText) return;

  // Display user message
  const userMsg = document.createElement('div');
  userMsg.classList.add('message', 'user-msg');
  userMsg.innerText = userText;
  chatBox.appendChild(userMsg);

  // Generate bot response
  const lowerText = userText.toLowerCase();
  let botText = responses[lowerText] || "I’m still learning. Can you try asking differently?";
  const botMsg = document.createElement('div');
  botMsg.classList.add('message', 'bot-msg');
  botMsg.innerText = botText;
  chatBox.appendChild(botMsg);

  // Clear input
  userInput.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;
});

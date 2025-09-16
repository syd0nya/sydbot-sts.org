const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const typingIndicator = document.getElementById('typing-indicator');

async function getAIResponse(userMessage) {
  // Hugging Face free model endpoint
  const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Optional: This public endpoint works without a key but may rate-limit.
    },
    body: JSON.stringify({
      inputs: `You are SydBot, a professional IT support and cybersecurity assistant. Answer clearly and helpfully.\nUser: ${userMessage}\nSydBot:`
    })
  });

  const data = await response.json();
  return data[0]?.generated_text?.split("SydBot:")[1]?.trim() || "I'm having trouble responding right now.";
}

sendBtn.addEventListener('click', async () => {
  const userText = userInput.value.trim();
  if (!userText) return;

  // Display user message
  const userMsg = document.createElement('div');
  userMsg.classList.add('message', 'user-msg');
  userMsg.innerText = userText;
  chatBox.appendChild(userMsg);

  // Clear input
  userInput.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  // Show typing indicator
  typingIndicator.style.display = 'flex';

  // Get AI response
  const botReply = await getAIResponse(userText);

  // Hide typing indicator
  typingIndicator.style.display = 'none';

  // Display bot message
  const botMsg = document.createElement('div');
  botMsg.classList.add('message', 'bot-msg');
  botMsg.innerText = botReply;
  chatBox.appendChild(botMsg);

  chatBox.scrollTop = chatBox.scrollHeight;
});

// Allow Enter key to send
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

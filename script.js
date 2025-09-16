const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");

let knowledge = [];

// Load knowledge
async function loadKnowledge() {
  const res = await fetch("knowledge.json");
  knowledge = await res.json();
}
loadKnowledge();

// Calculate match score for a message
function matchScore(message, patterns) {
  message = message.toLowerCase();
  let score = 0;
  for (let p of patterns) {
    if (message.includes(p.toLowerCase())) score++;
  }
  return score;
}

// Get AI response
function getAIResponse(message) {
  let bestMatch = null;
  let maxScore = 0;

  for (let item of knowledge) {
    let score = matchScore(message, item.patterns);
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 0) return bestMatch.response;
  return "I’m still learning. Can you try asking differently?";
}

// Send button
sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (!text) return;

  // User message
  const userMsg = document.createElement("div");
  userMsg.classList.add("message", "user-msg");
  userMsg.innerText = text;
  chatBox.appendChild(userMsg);
  userInput.value = "";

  // Typing animation
  typingIndicator.style.display = "block";
  setTimeout(() => {
    const botMsg = document.createElement("div");
    botMsg.classList.add("message", "bot-msg");
    botMsg.innerText = getAIResponse(text);
    chatBox.appendChild(botMsg);
    typingIndicator.style.display = "none";
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);
});

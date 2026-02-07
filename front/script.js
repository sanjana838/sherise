async function sendMessage() {
  const input = document.getElementById("message");
  const chatBox = document.getElementById("chat-box");

  const text = input.value.trim();
  if (!text) return;

  chatBox.innerHTML += `<div class="user">You: ${text}</div>`;
  input.value = "";

  try {
    const res = await fetch("/chatbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    chatBox.innerHTML += `<div class="bot">Bot: ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    chatBox.innerHTML += `<div class="bot">⚠️ Server error</div>`;
  }
}

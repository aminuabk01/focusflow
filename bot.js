const TOKEN = process.env.TOKEN;
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("."));

// Welcome message when someone sends /start
app.post("/webhook", async (req, res) => {
  const update = req.body;
  const msg = update.message;

  if (msg && msg.text === "/start") {
    const chatId = msg.chat.id;
    const name = msg.from.first_name || "there";

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: "HTML",
        text: `👋 Hey <b>${name}</b>, welcome to FocusFlow!

⚡ Your smart productivity assistant is ready.

Here's what you can do:
✅ <b>Manage Tasks</b> — stay on top of your work
⏱️ <b>Set Countdowns</b> — track your deadlines
🔔 <b>Get Reminders</b> — never miss anything

Tap the button below to open your dashboard 👇`
      })
    });
  }

  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 3000;
// Keep Render awake
const RENDER_URL = process.env.RENDER_URL;
setInterval(async () => {
  try {
    await fetch(RENDER_URL);
    console.log("Keeping awake...");
  } catch (e) {
    console.log("Ping failed");
  }
}, 840000); // ping every 14 minutes
app.listen(PORT, () => {
  console.log(`FocusFlow bot running on port ${PORT}`);
  setWebhook();
});

// Auto-set webhook on startup
async function setWebhook() {
  const url = process.env.RENDER_URL;
  if (!url) return;
  await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: `${url}/webhook` })
  });
  console.log("Webhook set to:", url);
}
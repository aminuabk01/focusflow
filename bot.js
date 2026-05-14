const TOKEN = process.env.TOKEN;
const RENDER_URL = process.env.RENDER_URL;
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("."));

// Welcome message
app.post("/webhook", async (req, res) => {
  try {
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
      console.log("Welcome message sent to:", chatId);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

// Keep Render awake
setInterval(async () => {
  try {
    await fetch(RENDER_URL);
    console.log("Keeping awake...");
  } catch (e) {
    console.log("Ping failed");
  }
}, 840000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`FocusFlow bot running on port ${PORT}`);
  console.log("TOKEN:", TOKEN ? "Found ✅" : "Missing ❌");
  console.log("RENDER_URL:", RENDER_URL ? RENDER_URL + " ✅" : "Missing ❌");

  // Set webhook
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: `${RENDER_URL}/webhook` })
    });
    const data = await res.json();
    console.log("Webhook result:", data.ok ? "Set ✅" : "Failed ❌", data.description);
  } catch (e) {
    console.error("Webhook setup error:", e);
  }
});
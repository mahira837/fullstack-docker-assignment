const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:5000";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/submit", async (req, res) => {
  try {
    // Express forwards the submitted form data to Flask over the Compose network.
    const response = await fetch(`${BACKEND_URL}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
      })
    });

    const result = await response.json();
    if (!response.ok) {
      return res.status(response.status).send(result.error || "Backend request failed.");
    }

    res.send(`
      <!doctype html>
      <html lang="en">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Submission received</title><link rel="stylesheet" href="/style.css"></head>
      <body><main class="card">
        <h1>Submission received!</h1>
        <p>${escapeHtml(result.message)}</p>
        <p><strong>Name:</strong> ${escapeHtml(result.data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(result.data.email)}</p>
        <p><strong>Message:</strong> ${escapeHtml(result.data.message)}</p>
        <a href="/">Submit another response</a>
      </main></body></html>
    `);
  } catch (error) {
    console.error("Could not contact Flask backend:", error);
    res.status(502).send("Could not connect to the Flask backend. Please try again.");
  }
});

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

app.get("/health", (_req, res) => res.json({ status: "ok", service: "frontend" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend listening on port ${PORT}`);
});

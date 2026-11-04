from flask import Flask, jsonify, request

app = Flask(__name__)

@app.get("/")
def home():
    return jsonify({"status": "ok", "service": "flask-backend"})

@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "backend"})

@app.post("/api/submit")
def submit_form():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required."}), 400

    if len(name) > 100 or len(email) > 150 or len(message) > 1000:
        return jsonify({"error": "One or more fields exceed the allowed length."}), 400

    # Assignment demo: process and return the submitted data.
    # Add a database here if you need permanent storage.
    return jsonify({
        "message": "Your form was successfully processed by Flask.",
        "data": {"name": name, "email": email, "message": message}
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

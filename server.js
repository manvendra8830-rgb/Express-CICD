const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "Express frontend is running successfully.",
        service: "express-cicd"
    });
});

app.post("/submit", async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/submittodoitem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                itemName: req.body.itemName,
                itemDescription: req.body.itemDescription
            })
        });

        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({
            error: "Unable to connect to Flask backend.",
            details: error.message
        });
    }
});

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Express server running on port ${PORT}`);
        console.log(`Backend URL: ${BACKEND_URL}`);
    });
}

module.exports = app;

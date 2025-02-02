const fs = require("fs");
const path = require("path");

const jsonFilePath = "./samples/output.wav.json";

module.exports = (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (fs.existsSync(jsonFilePath)) {
        res.sendFile(path.resolve(jsonFilePath));
    } else {
        res.status(404).json({ error: "File not found. Run /api/run first." });
    }
};

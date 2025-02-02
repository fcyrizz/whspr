const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const whisperCliPath = "./build/bin/whisper-cli";
const modelPath = "build/ggml-tiny.en-q5_1.bin";
const audioPath = "./samples/output.wav";
const jsonFilePath = "./samples/output.wav.json";

// Function to run shell commands
function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            } else if (stderr) {
                reject(`Stderr: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
}

// Route to trigger transcription
app.get("/run", async (req, res) => {
    try {
        // Make whisper-cli executable
        await runCommand(`chmod +x ${whisperCliPath}`);

        // Run whisper-cli to generate the JSON file
        await runCommand(`${whisperCliPath} -m ${modelPath} ${audioPath}`);

        res.json({ message: "Transcription started. Check /result to fetch output." });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Route to serve the generated JSON file
app.get("/result", (req, res) => {
    if (fs.existsSync(jsonFilePath)) {
        res.sendFile(path.resolve(jsonFilePath));
    } else {
        res.status(404).json({ error: "File not found. Run /run first." });
    }
});

// Default route
app.get("/", (req, res) => {
    res.json({ message: "Use /run to process and /result to get output." });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Required for Vercel

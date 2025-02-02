const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

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

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // Make whisper-cli executable
        await runCommand(`chmod +x ${whisperCliPath}`);

        // Run whisper-cli to generate the JSON file
        await runCommand(`${whisperCliPath} -m ${modelPath} ${audioPath}`);

        res.json({ message: "Transcription started. Check /api/result to fetch output." });
    } catch (error) {
        res.status(500).json({ error });
    }
};

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

        // Serve the generated JSON file
        if (fs.existsSync(jsonFilePath)) {
            return res.sendFile(path.resolve(jsonFilePath));
        } else {
            return res.status(404).json({ error: "File not found." });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

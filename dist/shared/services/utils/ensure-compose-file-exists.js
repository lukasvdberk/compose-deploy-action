"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureComposeFileExists = void 0;
const fs_1 = require("fs");
/**
 * Ensures that the provided compose file exists
 */
async function ensureComposeFileExists(filePath) {
    if (!filePath) {
        throw new Error('No compose file path provided');
    }
    try {
        // throws if file does not exist
        await fs_1.promises.access(filePath);
    }
    catch (err) {
        throw new Error('Compose file does not exist or can not be accessed: ' + filePath);
    }
}
exports.ensureComposeFileExists = ensureComposeFileExists;

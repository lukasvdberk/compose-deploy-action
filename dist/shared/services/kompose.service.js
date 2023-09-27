"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KomposeService = void 0;
const run_command_1 = require("./utils/run-command");
/**
 * Kompose is a cli tool to convert docker-compose files to kubernetes manifests (yaml files)
 */
class KomposeService {
    composeFile;
    directoryToCreateManifests;
    constructor(composeFile, directoryToCreateManifests) {
        this.composeFile = composeFile;
        this.directoryToCreateManifests = directoryToCreateManifests;
    }
    /**
     * // TODO docs
     */
    async convertToKubernetesManifests() {
        // convert the compose file to kubernetes manifests
        const command = `kompose convert --out ${this.directoryToCreateManifests} -f ${this.composeFile}`;
        return await (0, run_command_1.runCommand)(command);
    }
}
exports.KomposeService = KomposeService;

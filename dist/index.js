"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const docker_compose_service_1 = require("./shared/services/docker-compose.service");
const config = {
    registryHost: 'https://fb91-82-172-134-32.ngrok-free.app', // TODO set to production when done
};
/**
 * Logs to the console and to the GitHub action log
 */
function log(logMessage) {
    console.log(logMessage);
    core.debug(logMessage);
}
/**
 * GitHub action for deploying a project
 */
async function main() {
    const projectId = core.getInput('project-id');
    const apiKey = process.env.API_KEY;
    const dockerComposeFileToDeploy = core.getInput('docker-compose-file');
    if (!projectId)
        throw new Error('Project id is required');
    if (!dockerComposeFileToDeploy)
        throw new Error('Docker compose file is required');
    if (!apiKey)
        throw new Error('API key is required. Make sure you set the API_KEY environment variable');
    log(`Deploying project ${projectId} with docker-compose file ${dockerComposeFileToDeploy}`);
    const composeService = new docker_compose_service_1.DockerComposeService(dockerComposeFileToDeploy, config.registryHost, projectId, // use the project id as the image name prefix
    {
        username: projectId,
        password: apiKey // api key is the password
    });
    log('Building images');
    const buildLog = await composeService.buildImages();
    log(buildLog.logMessages);
    log(buildLog.errors);
    log('Pushing images');
    const pushLog = await composeService.pushImages();
    log(pushLog.logMessages);
    log(pushLog.errors);
    log('Deployment complete');
    // TODO upload docker compose file to the project
    // TODO to deploy the project we need to run the docker compose file on the server
}
main().catch((error) => {
    core.setFailed(error.message);
    log(error.message);
});

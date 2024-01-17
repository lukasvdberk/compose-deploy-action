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
const deployment_service_1 = require("./shared/services/deployment.service");
const fs_1 = require("fs");
const config = {
    registryHost: 'registry.ployer.app',
    apiBaseUrl: 'https://api.ployer.app',
};
/**
 * Logs to the console and to the GitHub action log
 */
function log(logMessage) {
    console.log(logMessage);
    core.debug(logMessage);
}
async function getDockerComposeFileContent(dockerComposeFilePath) {
    const dockerComposeFileContent = await fs_1.promises.readFile(dockerComposeFilePath);
    return dockerComposeFileContent;
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
    let dockerComposeFileContent = await getDockerComposeFileContent(dockerComposeFileToDeploy);
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
    // finally deploy to our own backend
    const deploymentService = new deployment_service_1.DeploymentService(config.apiBaseUrl, projectId, apiKey);
    // re read the compose file content bc during the build the image names have been updated
    dockerComposeFileContent = await getDockerComposeFileContent(dockerComposeFileToDeploy);
    // update with newest compose file from repository
    await deploymentService.uploadDockerComposeFile(dockerComposeFileContent);
    // redeploy the containers with the new compose file
    await deploymentService.deployProject();
    log('Deployment complete');
}
main().catch((error) => {
    core.setFailed(error.message);
    log(error.message);
});

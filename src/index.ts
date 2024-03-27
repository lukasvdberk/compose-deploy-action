import * as core from '@actions/core'
import { DockerComposeService } from './shared/services/docker-compose.service';
import {DeploymentService} from "./shared/services/deployment.service";
import { promises as fs } from 'fs';

const config = {
    registryHost: 'registry.ployer.app',
    apiBaseUrl: 'https://api.ployer.app',
}
/**
 * Logs to the console and to the GitHub action log
 */
function log(logMessage: string) {
    console.log(logMessage);
    core.debug(logMessage);
}

async function getDockerComposeFileContent(dockerComposeFilePath: string) {
    const dockerComposeFileContent = await fs.readFile(dockerComposeFilePath);
    return dockerComposeFileContent;
}

/**
 * GitHub action for deploying a project
 */
async function main() {
    const projectId = core.getInput('project-id');
    const apiKey = process.env.API_KEY;
    const dockerComposeFileToDeploy = core.getInput('docker-compose-file');

    if(!projectId) throw new Error('Project id is required');
    if(!dockerComposeFileToDeploy) throw new Error('Docker compose file is required');
    if(!apiKey) throw new Error('API key is required. Make sure you set the API_KEY environment variable');

    let dockerComposeFileContent = await getDockerComposeFileContent(dockerComposeFileToDeploy);
    log(`Deploying project ${projectId} with docker-compose file ${dockerComposeFileToDeploy}`);

    const composeService = new DockerComposeService(
      dockerComposeFileToDeploy,
      config.registryHost,
      projectId, // use the project id as the image name prefix
        {
            username: projectId,
            password: apiKey // api key is the password
        }
    );
    log('Validating compose file');
    await composeService.composeFileValid();
    log('Building images');
    const buildLog = await composeService.buildImages();
    log(buildLog.logMessages);
    log(buildLog.errors);

    log('Pushing images');
    const pushLog = await composeService.pushImages();
    log(pushLog.logMessages);
    log(pushLog.errors);

    // finally deploy to our own backend
    const deploymentService = new DeploymentService(config.apiBaseUrl, projectId, apiKey);

    // re read the compose file content bc during the build the image names have been updated
    dockerComposeFileContent = await getDockerComposeFileContent(dockerComposeFileToDeploy);
    // update with newest compose file from repository
    await deploymentService.uploadDockerComposeFile(dockerComposeFileContent);

    // redeploy the containers with the new compose file
    await deploymentService.deployProject();
    log('Deployment complete');
}


main().catch((error) => {
    core.setFailed(error.message)
    log(error.message)
    log('Deployment failed, see error above. Checkout the documentation at https://ployer.app/docs for more information.')
});
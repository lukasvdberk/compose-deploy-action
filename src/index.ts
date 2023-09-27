import * as core from '@actions/core'
import { DockerComposeService } from './shared/services/docker-compose.service';

const config = {
    registryHost: 'localhost:5000', // TODO set to production when done
}
/**
 * Logs to the console and to the GitHub action log
 */
function log(logMessage: string) {
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

    if(!projectId) throw new Error('Project id is required');
    if(!dockerComposeFileToDeploy) throw new Error('Docker compose file is required');
    if(!apiKey) throw new Error('API key is required. Make sure you set the API_KEY environment variable');

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
    core.setFailed(error.message)
    log(error.message)
});
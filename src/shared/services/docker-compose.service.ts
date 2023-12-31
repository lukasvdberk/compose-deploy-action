import * as util from 'util';
import { ensureComposeFileExists } from './utils/ensure-compose-file-exists';
import { CliCommandResult } from '../models/cli-command-result';
import {runCommand} from "./utils/run-command";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promises: fs } = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const yaml = require('js-yaml');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);

// TODO docs
export class DockerComposeService {
  isAuthenticated = false;
  constructor(
    private composeFilePath: string,
    private registryHost: string,
    private imageNamePrefix: string,
    private dockerLoginCredentials: { username: string; password: string },
  ) {}

  /**
   * Builds all images
   */
  async buildImages(): Promise<CliCommandResult> {
    // await this.authenticateIfNecessary(); // TODO add authentication
    await ensureComposeFileExists(this.composeFilePath);
    await this.setImageForEachService();

    const composeCommand = `docker-compose -f ${this.composeFilePath} build`;
    return await runCommand(composeCommand);
  }
  setDefaultImage(serviceName: string) {
    return `${this.registryHost}/${this.imageNamePrefix}/${serviceName}:latest`;
  }

  async authenticateIfNecessary() {
    if (!this.isAuthenticated) {
      const command = this.dockerLoginCommand();
      await runCommand(command);
      this.isAuthenticated = true;
    }
  }

  dockerLoginCommand() {
    return `docker login -u ${this.dockerLoginCredentials.username} -p ${this.dockerLoginCredentials.password} ${this.registryHost}`;
  }

  /**
   * Adds an image to each service that does not have one defined
   */
  async setImageForEachService() {
    // Read the Docker Compose YAML file
    const data = await fs.readFile(this.composeFilePath, 'utf8');
    const composeConfig = yaml.load(data);

    for (const serviceName in composeConfig.services) {
      const service = composeConfig.services[serviceName];

      // Check if the service does not have an image defined or has a build argument
      if (!service.image || service.build) {
        // Set the image to our project for the registry
        service.image = this.setDefaultImage(serviceName);
      }
    }

    // Convert the modified object back to YAML
    const yamlStr = yaml.dump(composeConfig);

    // Write the YAML back to the file
    await fs.writeFile(this.composeFilePath, yamlStr, 'utf8');
  }

  /**
   * Pushes all images to the registry
   * @returns {string} - output of the push command
   */
  async pushImages(): Promise<CliCommandResult> {
    // await this.authenticateIfNecessary(); // TODO add authentication
    await ensureComposeFileExists(this.composeFilePath);
    const command = `docker-compose -f ${this.composeFilePath} push`;
    return await runCommand(command);
  }
}

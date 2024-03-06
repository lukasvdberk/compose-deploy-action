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
exports.DockerComposeService = void 0;
const util = __importStar(require("util"));
const ensure_compose_file_exists_1 = require("./utils/ensure-compose-file-exists");
const run_command_1 = require("./utils/run-command");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promises: fs } = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const yaml = require('js-yaml');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);
/**
 * Runs a command in the terminal and returns the output
 */
class DockerComposeService {
    composeFilePath;
    registryHost;
    imageNamePrefix;
    dockerLoginCredentials;
    isAuthenticated = false;
    MAXIMUM_AMOUNT_OF_CONTAINERS = 8;
    constructor(composeFilePath, registryHost, imageNamePrefix, dockerLoginCredentials) {
        this.composeFilePath = composeFilePath;
        this.registryHost = registryHost;
        this.imageNamePrefix = imageNamePrefix;
        this.dockerLoginCredentials = dockerLoginCredentials;
    }
    /**
     * Validates if all container names are valid
     */
    async composeFileValid() {
        const containerNames = await this.getContainerNames();
        for (const containerName of containerNames) {
            if (!this.isContainerNameValid(containerName)) {
                throw new Error(`Container name ${containerName} is not valid, it must be a hostname (For example test-1 or example. Not something like test_1).`);
            }
        }
        if (this.MAXIMUM_AMOUNT_OF_CONTAINERS < containerNames.length) {
            throw new Error(`The maximum amount of containers is ${this.MAXIMUM_AMOUNT_OF_CONTAINERS}. You have ${containerNames.length} containers.`);
        }
    }
    /**
     * Validates if it is a valid container name for kubernetes
     * Any container name is valid if it is a valid domain name.
     * @param containerName
     * @private
     */
    isContainerNameValid(containerName) {
        const regex = /^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$/g;
        ;
        return regex.test(containerName.replace('-', '')); // remove hyphens since they are allowed
    }
    /**
     * Builds all images
     */
    async buildImages() {
        await (0, ensure_compose_file_exists_1.ensureComposeFileExists)(this.composeFilePath);
        await this.setImageForEachService();
        const composeCommand = `docker-compose -f ${this.composeFilePath} build`;
        return await (0, run_command_1.runCommand)(composeCommand);
    }
    setDefaultImage(serviceName) {
        return `${this.registryHost}/${this.imageNamePrefix}/${serviceName}:latest`;
    }
    async authenticateIfNecessary() {
        const command = this.dockerLoginCommand();
        await (0, run_command_1.runCommand)(command);
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
    async pushImages() {
        await this.authenticateIfNecessary();
        await (0, ensure_compose_file_exists_1.ensureComposeFileExists)(this.composeFilePath);
        const command = `docker-compose -f ${this.composeFilePath} push`;
        return await (0, run_command_1.runCommand)(command);
    }
    async getContainerNames() {
        const data = await fs.readFile(this.composeFilePath, 'utf8');
        const composeConfig = yaml.load(data);
        return Object.keys(composeConfig.services);
    }
}
exports.DockerComposeService = DockerComposeService;

import { CliCommandResult } from '../models/cli-command-result';
/**
 * Runs a command in the terminal and returns the output
 */
export declare class DockerComposeService {
    private composeFilePath;
    private registryHost;
    private imageNamePrefix;
    private dockerLoginCredentials;
    isAuthenticated: boolean;
    constructor(composeFilePath: string, registryHost: string, imageNamePrefix: string, dockerLoginCredentials: {
        username: string;
        password: string;
    });
    /**
     * Validates if all container names are valid
     */
    composeFileValid(): Promise<void>;
    /**
     * Validates if it is a valid container name for kubernetes
     * Any container name is valid if it is a valid domain name.
     * @param containerName
     * @private
     */
    isContainerNameValid(containerName: string): Promise<boolean>;
    /**
     * Builds all images
     */
    buildImages(): Promise<CliCommandResult>;
    setDefaultImage(serviceName: string): string;
    authenticateIfNecessary(): Promise<void>;
    dockerLoginCommand(): string;
    /**
     * Adds an image to each service that does not have one defined
     */
    setImageForEachService(): Promise<void>;
    /**
     * Pushes all images to the registry
     * @returns {string} - output of the push command
     */
    pushImages(): Promise<CliCommandResult>;
    private getContainerNames;
}

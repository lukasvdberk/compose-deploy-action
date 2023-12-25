/// <reference types="node" />
/**
 * Service for deploying a project to our own API
 */
export declare class DeploymentService {
    private apiBaseUrl;
    private projectId;
    private apiKey;
    /**
     * @param apiBaseUrl - The base url of the API to deploy to (e.g. https://api.ployer.app)
     * @param projectId - The id of the project to deploy
     * @param apiKey - The api key to use for authentication
     */
    constructor(apiBaseUrl: string, projectId: string, apiKey: string);
    uploadDockerComposeFile(dockerComposeFileContent: Buffer): Promise<void>;
    deployProject(): Promise<any>;
    private postFile;
    private getAuthorisationHeaders;
    private getProjectApiUrlWithProjectId;
}

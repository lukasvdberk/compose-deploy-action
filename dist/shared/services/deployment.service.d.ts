/// <reference types="node" />
export declare class DeploymentService {
    private apiBaseUrl;
    private projectId;
    private apiKey;
    constructor(apiBaseUrl: string, projectId: string, apiKey: string);
    uploadDockerComposeFile(dockerComposeFileContent: Buffer): Promise<void>;
    deployProject(): Promise<any>;
    private postFile;
    private getAuthorisationHeaders;
    private getProjectApiUrlWithProjectId;
}

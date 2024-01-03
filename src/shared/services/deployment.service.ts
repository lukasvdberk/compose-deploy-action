import FormData from 'form-data';
import axios from "axios";
const fs = require('fs');

/**
 * Service for deploying a project to our own API
 */
export class DeploymentService {
    /**
     * @param apiBaseUrl - The base url of the API to deploy to (e.g. https://api.ployer.app)
     * @param projectId - The id of the project to deploy
     * @param apiKey - The api key to use for authentication
     */
    constructor(
        private apiBaseUrl: string,
        private projectId: string,
        private apiKey: string,
    ) {
    }

    async uploadDockerComposeFile(dockerComposeFileContent: Buffer) {
        const authorisationHeaders = this.getAuthorisationHeaders();
        await this.postFile(`${this.getProjectApiUrlWithProjectId()}/set-docker-compose-file`, 'PUT', dockerComposeFileContent, authorisationHeaders);
    }


    async deployProject() {
        const response = await axios.put(`${this.getProjectApiUrlWithProjectId()}/deploy`, {}, {
            headers: this.getAuthorisationHeaders()
        });
        return response.data;
    }


    private async postFile(url:string, method: string, fileContent: Buffer, headers: any): Promise<any> {
        const formData = new FormData();
        formData.append("file", fileContent, { filename : 'docker-compose.yml' });
        const response = await axios({
            method: method,
            url: url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data;boundary=' + formData.getBoundary(),
                ...headers
            }
        });
        return response.data;
    }

    private getAuthorisationHeaders() {
        return {
            authorization: `${this.projectId} ${this.apiKey}`
        }
    }
    private getProjectApiUrlWithProjectId() {
        return `${this.apiBaseUrl}/api/deployment/${this.projectId}`;
    }
}

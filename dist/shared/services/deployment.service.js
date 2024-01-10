"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentService = void 0;
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
/**
 * Service for deploying a project to our own API
 */
class DeploymentService {
    apiBaseUrl;
    projectId;
    apiKey;
    /**
     * @param apiBaseUrl - The base url of the API to deploy to (e.g. https://api.ployer.app)
     * @param projectId - The id of the project to deploy
     * @param apiKey - The api key to use for authentication
     */
    constructor(apiBaseUrl, projectId, apiKey) {
        this.apiBaseUrl = apiBaseUrl;
        this.projectId = projectId;
        this.apiKey = apiKey;
    }
    async uploadDockerComposeFile(dockerComposeFileContent) {
        const authorisationHeaders = this.getAuthorisationHeaders();
        await this.postFile(`${this.getProjectApiUrlWithProjectId()}/set-docker-compose-file`, 'PUT', dockerComposeFileContent, authorisationHeaders);
    }
    async deployProject() {
        const response = await axios_1.default.put(`${this.getProjectApiUrlWithProjectId()}/deploy`, {}, {
            headers: this.getAuthorisationHeaders()
        });
        return response.data;
    }
    async postFile(url, method, fileContent, headers) {
        const formData = new form_data_1.default();
        formData.append("file", fileContent, { filename: 'docker-compose.yml' });
        const response = await (0, axios_1.default)({
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
    getAuthorisationHeaders() {
        return {
            authorization: `${this.projectId} ${this.apiKey}`
        };
    }
    getProjectApiUrlWithProjectId() {
        return `${this.apiBaseUrl}/api/deployment/${this.projectId}`;
    }
}
exports.DeploymentService = DeploymentService;

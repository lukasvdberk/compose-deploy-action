"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentService = void 0;
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
const fs = require('fs');
// TODO docs
class DeploymentService {
    apiBaseUrl;
    projectId;
    apiKey;
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
        const response = await axios_1.default.put(`${this.apiBaseUrl}/${this.projectId}/deploy`, {}, {
            headers: this.getAuthorisationHeaders()
        });
        return response.data;
    }
    async postFile(url, method, fileContent, headers) {
        const formData = new form_data_1.default();
        formData.append("file", fs.createReadStream(fileContent));
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
        return `${this.apiBaseUrl}/${this.projectId}`;
    }
}
exports.DeploymentService = DeploymentService;

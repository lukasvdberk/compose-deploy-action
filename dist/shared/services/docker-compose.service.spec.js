"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const docker_compose_service_1 = require("./docker-compose.service");
describe('DockerComposeService', () => {
    it('build docker images and set registry', async () => {
        // TODO re add api when needed and remove testing code
        // const app = await NestFactory.create(AppModule);
        // await app.listen(3000);
        // get working directory path (backend)
        const workingDirectoryPath = process.cwd();
        const composeFilePath = path_1.default.join(workingDirectoryPath, 'docker-compose-test-project', 'docker-compose.yml');
        const registryHost = 'localhost:5000';
        const imageNamePrefix = 'project1';
        const composeService = new docker_compose_service_1.DockerComposeService(composeFilePath, registryHost, imageNamePrefix);
        const buildLog = await composeService.buildImages();
        console.log(buildLog.logMessages);
        console.log(buildLog.errors);
    });
});

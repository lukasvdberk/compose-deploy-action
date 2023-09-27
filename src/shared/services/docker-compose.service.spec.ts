import path from 'path';
import { DockerComposeService } from './docker-compose.service';

describe('DockerComposeService', () => {
  it('build docker images and set registry', async () => {
    // TODO re add api when needed and remove testing code
    // const app = await NestFactory.create(AppModule);
    // await app.listen(3000);
    // get working directory path (backend)
    const workingDirectoryPath = process.cwd();
    const composeFilePath = path.join(
      workingDirectoryPath,
      'docker-compose-test-project',
      'docker-compose.yml',
    );
    const registryHost = 'localhost:5000';
    const imageNamePrefix = 'project1';

    const composeService = new DockerComposeService(
      composeFilePath,
      registryHost,
      imageNamePrefix,
    );
    const buildLog = await composeService.buildImages();
    console.log(buildLog.logMessages);
    console.log(buildLog.errors);
  });
});

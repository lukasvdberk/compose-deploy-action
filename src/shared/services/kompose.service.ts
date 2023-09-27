import { runCommand } from './utils/run-command';
import { CliCommandResult } from '../models/cli-command-result';

/**
 * Kompose is a cli tool to convert docker-compose files to kubernetes manifests (yaml files)
 */
export class KomposeService {
  constructor(private composeFile: string, private directoryToCreateManifests) {}

  /**
   * // TODO docs
   */
  async convertToKubernetesManifests(): Promise<CliCommandResult> {
    // convert the compose file to kubernetes manifests
    const command = `kompose convert --out ${this.directoryToCreateManifests} -f ${this.composeFile}`;
    return await runCommand(command);
  }
}

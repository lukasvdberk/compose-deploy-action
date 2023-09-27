import { CliCommandResult } from '../models/cli-command-result';
/**
 * Kompose is a cli tool to convert docker-compose files to kubernetes manifests (yaml files)
 */
export declare class KomposeService {
    private composeFile;
    private directoryToCreateManifests;
    constructor(composeFile: string, directoryToCreateManifests: any);
    /**
     * // TODO docs
     */
    convertToKubernetesManifests(): Promise<CliCommandResult>;
}

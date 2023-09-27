import { CliCommandResult } from '../../models/cli-command-result';
/**
 * Runs a command in the terminal and returns the output
 */
export declare function runCommand(cliCommand: string): Promise<CliCommandResult>;

import * as util from 'util';
import { CliCommandResult } from '../../models/cli-command-result';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);

/**
 * Runs a command in the terminal and returns the output
 */
export async function runCommand(
  cliCommand: string,
): Promise<CliCommandResult> {
  const { stdout, stderr } = await exec(cliCommand);
  return {
    errors: stderr,
    logMessages: stdout,
  };
}

import { promises as fs } from 'fs';
import * as constants from "constants";

/**
 * Ensures that the provided compose file exists
 */
export async function ensureComposeFileExists(filePath: string): Promise<void> {
  if (!filePath) {
    throw new Error('No compose file path provided');
  }
  try {
    // throws if file does not exist
    await fs.access(filePath, constants.R_OK);
  } catch (err) {
    throw new Error(
      'Compose file does not exist or can not be accessed: ' + filePath,
    );
  }
}

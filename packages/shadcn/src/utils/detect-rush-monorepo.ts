
import { join, dirname } from 'path';
import { existsSync } from 'fs';

export interface RushDetectOptions{
  cwd?:string
}
/**
* The root-level configuration file of a @microsoft/rush mono repo.
*/
const rushJsonFilename: 'rush.json' = 'rush.json';

/**
 * Looks for rush.json location and return true if rush.json is found.
 * @returns {boolean} - Returns true if rush.json is found.
 *
 * @privateRemarks
 * inspired by : https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/api/RushConfiguration.ts#L1067
 */
export function detectRushMonoRepo(options: RushDetectOptions = {}): boolean {

  let currentFolder: string = options.cwd || process.cwd();
  let parentFolder: string = dirname(currentFolder);

  // look upwards at parent folders until we find a folder containing rush.json,
  // or we reach the root directory without finding a rush.json file
  while (parentFolder && parentFolder !== currentFolder) {

    const expectedRushJson: string = join(currentFolder, rushJsonFilename);

    if (existsSync(expectedRushJson)) {
      return true;
    }

    currentFolder = parentFolder;
    parentFolder = dirname(currentFolder);
  }

  return false;
}

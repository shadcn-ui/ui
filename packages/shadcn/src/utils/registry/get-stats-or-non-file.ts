import type { Stats } from "fs"
import { stat } from "fs/promises"

const getStatsOrNonFile = async (path: string): Promise<Stats> => {
  try {
    const stats = await stat(path)

    return stats
  } catch (error) {
    return { isFile: () => false } as Stats
  }
}

export { getStatsOrNonFile }

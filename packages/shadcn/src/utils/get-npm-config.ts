import { execa } from "execa"
import { handleError } from "./handle-error"

export async function getNpmConfig(cwd: string) {
  try {
    // This will match any .npmrc file 
    const { stdout } = await execa("npm", ["config", "list", "--json"], {
      cwd,
    })
    
    return JSON.parse(stdout) as Record<string, any>
  } catch (error) {
    console.log('Something went wrong getting the npm config')
    handleError(error)
  }
}

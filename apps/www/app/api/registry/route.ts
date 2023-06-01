import registry from "./registry.json"

export async function GET() {
  return new Response(JSON.stringify(registry))
}

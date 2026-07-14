import type { StreamChunk } from "@tanstack/ai/client"

import { createChat } from "./index"

export type WeatherOutput = {
  city: string
  temperature: number
  condition: string
}

export const weatherOutput: WeatherOutput = {
  city: "San Francisco",
  temperature: 72,
  condition: "sunny",
}

export async function collectChunks(iterable: AsyncIterable<StreamChunk>) {
  const chunks: StreamChunk[] = []

  for await (const chunk of iterable) {
    chunks.push(chunk)
  }

  return chunks
}

export function createWeatherChat() {
  return createChat()
    .user("What's the weather?")
    .assistant(({ writer }) => {
      writer.reasoning("I need to call the weather tool.", {
        mode: "instant",
      })

      const weather = writer.tool("getWeather", {
        input: {
          city: "San Francisco",
        },
      })

      weather.output(weatherOutput)
      writer.text("It's sunny.", {
        mode: "instant",
      })
    })
}

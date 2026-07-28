export type DataParts = {
  weather: {
    city: string
    status: "loading" | "success" | "error"
    temperature?: number
    condition?: string
  }
  artifact: {
    id: string
    title: string
    kind: "code" | "document" | "image"
    status: "draft" | "streaming" | "complete"
  }
}

export type Tools = {
  getWeather: {
    input: {
      city: string
    }
    output: {
      city: string
      temperature: number
      condition: string
    }
  }
  createFile: {
    input: {
      filename: string
      content: string
    }
    output: {
      filename: string
      url: string
    }
  }
}

export const weatherLoading: DataParts["weather"] = {
  city: "San Francisco",
  status: "loading",
}

export const weatherSuccess: DataParts["weather"] = {
  city: "San Francisco",
  status: "success",
  temperature: 72,
  condition: "sunny",
}

export const weatherOutput: Tools["getWeather"]["output"] = {
  city: "San Francisco",
  temperature: 72,
  condition: "sunny",
}

export const artifact: DataParts["artifact"] = {
  id: "artifact-1",
  title: "CitedAnswer.jsx",
  kind: "code",
  status: "complete",
}

export async function readStream<T>(stream: ReadableStream<T>) {
  const chunks = []
  const reader = stream.getReader()

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    chunks.push(value)
  }

  return chunks
}

# @shadcn/helpers

A collection of helpers for building AI applications.

## createChat

```ts
import { createChat } from "@shadcn/helpers/ai-sdk"

const chat = createChat()
  .user("What's the weather in San Francisco?")
  .sleep(800)
  .assistant(({ writer }) => {
    writer.reasoning("I should call the weather tool first.")
    writer
      .tool("getWeather", { input: { city: "San Francisco" } })
      .sleep(1200)
      .output({ temperature: 72, condition: "sunny" })
    writer.text("It's sunny and 72 degrees in San Francisco.")
  })
```

## Installation

```bash
npm install @shadcn/helpers
```

## Documentation

Visit https://ui.shadcn.com/docs to view the documentation.

## Contributing

Please read the [contributing guide](https://github.com/shadcn-ui/ui/blob/main/CONTRIBUTING.md).

## License

Licensed under the [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).

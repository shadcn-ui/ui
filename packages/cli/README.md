# shadcn-ui

A CLI for adding components to your project.

> [!WARNING]
> The shadcn-ui CLI is going to be deprecated soon. Bug fixes and new features should be added to the `.packages/shadcn` instead.

## Usage

Use the `init` command to initialize dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, configures `tailwind.config.js`, and CSS variables for the project.

```bash
npx shadcn-ui init
```

## add

Use the `add` command to add components to your project.

The `add` command adds a component to your project and installs all required dependencies.

```bash
npx shadcn-ui add [component]
```

### Example

```bash
npx shadcn-ui add alert-dialog
```

You can also run the command without any arguments to view a list of all available components:

```bash
npx shadcn-ui add
```

## Documentation

Visit https://ui.shadcn.com/docs/cli to view the documentation.

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).

# shadcn

A CLI for adding components to your project.

## Usage

Use the `init` command to initialize dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, configures `tailwind.config.js`, and CSS variables for the project.

```bash
npx shadcn init
```

## add

Use the `add` command to add components to your project.

The `add` command adds a component to your project and installs all required dependencies.

```bash
npx shadcn add [component]
```

### Example

```bash
npx shadcn add alert-dialog
```

You can also run the command without any arguments to view a list of all available components:

```bash
npx shadcn add
```

## generate

Use the `generate` command to create boilerplate code for various types of files.

```bash
npx shadcn generate [type] [name]
```

or use the shorter alias:

```bash
npx shadcn gen [type] [name]
```

### Examples

```bash
# Generate a component
npx shadcn generate component button

# Generate a custom hook
npx shadcn gen hook use-counter

# Generate a utility function
npx shadcn generate util format-date

# Generate a context provider
npx shadcn gen context theme
```

### Available Types

- `component` - React component with TypeScript
- `hook` - Custom React hook
- `util` - Utility function
- `context` - React Context with Provider
- `page` - Next.js page component
- `layout` - Next.js layout component
- `api` - Next.js API route

## Documentation

Visit https://ui.shadcn.com/docs/cli to view the documentation.

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).

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


## remove

Use the `remove` command to remove components from your project.

The `remove` command remove a component from your project and uninstalls all its dependencies.

```bash
npx shadcn remove [component]
```

### Example

```bash
npx shadcn remove alert-dialog
```

You can also run the command without any arguments to view a list of all installed components:

```bash
npx shadcn remove
```


## Documentation

Visit https://ui.shadcn.com/docs/cli to view the documentation.

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).

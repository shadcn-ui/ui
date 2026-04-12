# shadcn

A CLI for adding components to your project.

## create

Use the `create` command to create a new project. You will be taken to a website to build your custom design system and choose your framework.

```bash
npx shadcn create
```

## init

Use the `init` command to initialize dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, configures Tailwind CSS, and CSS variables for the project.

```bash
npx shadcn init
```

## apply

Use the `apply` command to apply a preset to an existing project.

The `apply` command overwrites the current preset configuration, reinstalls detected UI components, and updates fonts and CSS variables to match the new preset.

```bash
npx shadcn apply --preset a2r6bw
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

## Documentation

Visit https://ui.shadcn.com/docs/cli to view the documentation.

## License

Licensed under the [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).

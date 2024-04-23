
# Contributing

Thanks for your interest in contributing to ui.shadcn.com. 
<br>
<h4>We're happy to have you here.</h4>

<br>
<br>

# Before Starting

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.
<br>
<br>

<h4>If you need any help, feel free to reach out to [@shadcn](https://twitter.com/shadcn).</h4>

<br>
<br>

# About this repository

**This repository is a monorepo.**

- We use [pnpm](https://pnpm.io) and [`workspaces`](https://pnpm.io/workspaces) for development.

- We use [Turborepo](https://turbo.build/repo) as our build system.

- We use [changesets](https://github.com/changesets/changesets) for managing releases.

<br>
<br>
  

# Structure

**This repository is structured as follows:**

```
apps
└── www
    ├── app
    ├── components
    ├── content
    └── registry
        ├── default
        │   ├── example
        │   └── ui
        └── new-york
            ├── example
            └── ui
packages
└── cli
```

<br>
  

| Path                  | Description                              |
| --------------------- | ---------------------------------------- |
| `apps/www/app`        | The Next.js application for the website. |
| `apps/www/components` | The React components for the website.    |
| `apps/www/content`    | The content for the website.             |
| `apps/www/registry`   | The registry for the components.         |
| `packages/cli`        | The `shadcn-ui` package.                 |


<br>
<br>
<br>

# Clone Project
 
### Fork this repo

 ``You can fork this repo By clicking the fork button in the top right corner of this page.``

*or*

 ``You can fork By clickling this link:`` [Fork](https://github.com/shadcn-ui/ui/fork)
 
 <br>

### Clone on your local machine

```bash

git  clone  https://github.com/your-username/ui.git

```
<br>
<br>
<br>

 

# After Coning project

### Navigate to project directory

```bash

cd  ui

```
<br>
  

### Create a new Branch

```bash

git  checkout  -b  my-new-branch

```
*At (my-new-branch) change the name to what problem your solving.*

<br>

### Install dependencies

  

```bash

pnpm  install

```
<br>
<br>
<br>
  

# Run a workspace

  

**You can use the `pnpm --filter=[WORKSPACE]` command to start the development process for a workspace.**



#### Examples

  

1. To run the `ui.shadcn.com` website:

  

```bash

pnpm  --filter=www  dev

```

<br>

  

2. To run the `shadcn-ui` package:

  

```bash

pnpm  --filter=shadcn-ui  dev

```

<br>
<br>
<br>
  

# Documentation

  

The documentation for this project is located in the `www` workspace. You can run the documentation locally by running the following command:
  

```bash

pnpm  --filter=www  dev

```
<br>
  

**Documentation is written using [MDX](https://mdxjs.com). You can find the documentation files in the `apps/www/content/docs` directory.**

<br>
<br>
<br>
  

# Components

  

We use a registry system for developing components. You can find the source code for the components under `apps/www/registry`. The components are organized by styles.

 
```bash
apps
└── www
    └── registry
        ├── default
        │   ├── example
        │   └── ui
        └── new-york
            ├── example
            └── ui
```



**When adding or modifying components, please ensure that:**

1. You make the changes for every style.

2. You update the documentation.

3. You run `pnpm build:registry` to update the registry.

<br>
<br>

# Commit Convention

**Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.**

 <br>

When you create a commit we kindly ask you to follow the convention
`category(scope or module): message` in your commit message while using one of
the following categories:

 <br>
 
 

 - **feat / feature:**

   *`All changes that introduce completely new code or new features`*
  
  <br>
  
- **fix**

  *`Changes that fix a bug (ideally you will additionally reference an issue if present)`*
  
  <br>
  
- **refactor**

  *`Any code related change that is not a fix nor a feature`*
  
  <br>

- **docs**

  *`Changing existing or creating new documentation (i.e. README, docs for usage of a lib or cli usage)`*
  
  <br>
  
- **build**

  *`All changes regarding the build of the software, changes to dependencies or the addition of new dependencies`*
  
  <br>
  
- **test**

  *`All changes regarding tests (adding new tests or changing existing* ones)`*
  
  <br>
  
- **ci**

  *`All changes regarding the configuration of continuous integration (i.e. github actions, ci system)`*
  
  <br>
  
- **chore**

  *`All changes to the repository that do not fit into any of the above categories`*
  
  ***e.g.  feat(components): add new prop to the avatar component***
  
  <br>
  

If you are interested in the detailed specification you can visit [Conventional Commits](https://www.conventionalcommits.org/) or check out the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

  <br>
  <br>


# Requests for new components

  

If you have a request for a new component, please open a discussion on GitHub. We'll be happy to help you out.

  <br>
  <br>

# CLI

  

The `shadcn-ui` package is a CLI for adding components to your project. You can find the documentation for the CLI [here](https://ui.shadcn.com/docs/cli).

  

Any changes to the CLI should be made in the `packages/cli` directory. If you can, it would be great if you could add tests for your changes.

  <br>
  <br>

# Testing

  

Tests are written using [Vitest](https://vitest.dev). You can run all the tests from the root of the repository.

      

```bash

pnpm  test

```

  

***Please ensure that the tests are passing when submitting a pull request. If you're adding new features, please include tests.***

import path from "path"
import { type Config } from "@/src/utils/get-config"
import { transformAsChild } from "@/src/utils/transformers/transform-aschild"
import { Project, ts } from "ts-morph"
import { describe, expect, test } from "vitest"

import { transform } from "."

const testConfig: Config = {
  style: "base-default",
  tsx: true,
  rsc: true,
  tailwind: {
    baseColor: "neutral",
    cssVariables: true,
    config: "tailwind.config.ts",
    css: "tailwind.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: "/",
    components: "/components",
    utils: "/lib/utils",
    ui: "/ui",
    lib: "/lib",
    hooks: "/hooks",
    tailwindConfig: "tailwind.config.ts",
    tailwindCss: "tailwind.css",
  },
}

function getGeneratedTypeScriptDiagnostics(source: string) {
  const appRoot = path.resolve(process.cwd(), "../../apps/v4")
  const generatedFile = path.join(
    appRoot,
    "registry/bases/base/ui/__generated-component.tsx"
  )
  const buttonFile = path.join(
    appRoot,
    "registry/bases/base/ui/__generated-button.ts"
  )
  const compilerOptions: ts.CompilerOptions = {
    allowSyntheticDefaultImports: true,
    baseUrl: appRoot,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    paths: {
      "@/components/ui/button": ["registry/bases/base/ui/__generated-button"],
    },
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ES2022,
  }
  const project = new Project({
    compilerOptions,
    skipAddingFilesFromTsConfig: true,
  })
  project.createSourceFile(
    buttonFile,
    `export function buttonVariants(props?: {
  variant?: "default" | "outline"
  size?: "default" | "sm"
  className?: string
}) {
  return ""
}`
  )

  return project
    .createSourceFile(generatedFile, source)
    .getPreEmitDiagnostics()
    .map((diagnostic) => diagnostic.getMessageText())
}

describe("transformAsChild", () => {
  describe("DialogTrigger with Button child", () => {
    test("transforms asChild to render prop without nativeButton", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <DialogTrigger asChild>
      <Button variant="outline">Edit Profile</Button>
    </DialogTrigger>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { Button } from "@/components/ui/button"

        export function Component() {
          return (
            <DialogTrigger render={<Button variant="outline" />}>Edit Profile</DialogTrigger>
          )
        }"
      `)
    })
  })

  describe("DialogTrigger with non-Button child", () => {
    test("transforms asChild to render prop without nativeButton", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DialogTrigger asChild>
      <a href="#">Open Dialog</a>
    </DialogTrigger>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DialogTrigger render={<a href="#" />}>Open Dialog</DialogTrigger>
          )
        }"
      `)
    })
  })

  describe("Button with anchor child", () => {
    test("styles the anchor directly with buttonVariants", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <Button asChild>
      <a href="#">Create project</a>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { buttonVariants } from "@/components/ui/button"

        export function Component() {
          return (
            <a data-slot="button" href="#" className={buttonVariants()}>Create project</a>
          )
        }"
      `)
    })
  })

  describe("Button with span child", () => {
    test("transforms asChild to render prop with nativeButton={false}", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <Button variant="outline" asChild size="icon" className="w-12">
      <span>1.2K</span>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { Button } from "@/components/ui/button"

        export function Component() {
          return (
            <Button variant="outline" size="icon" className="w-12" render={<span />} nativeButton={false}>1.2K</Button>
          )
        }"
      `)
    })
  })

  describe("PopoverTrigger with custom component child", () => {
    test("transforms asChild to render prop without nativeButton", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <PopoverTrigger asChild>
      <InputGroupAddon>Click me</InputGroupAddon>
    </PopoverTrigger>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <PopoverTrigger render={<InputGroupAddon />}>Click me</PopoverTrigger>
          )
        }"
      `)
    })
  })

  describe("Button with Link child", () => {
    test("styles the Link directly with buttonVariants", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <Button asChild>
      <Link href="/">Home</Link>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import Link from "next/link"
        import { buttonVariants } from "@/components/ui/button"

        export function Component() {
          return (
            <Link data-slot="button" href="/" className={buttonVariants()}>Home</Link>
          )
        }"
      `)
    })
  })

  describe("preserves child props", () => {
    test("preserves className and other attributes on child", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <Button variant="link" asChild className="text-muted-foreground">
      <a href="#" className="font-bold" data-test="link">
        Learn more
      </a>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { buttonVariants } from "@/components/ui/button"

        export function Component() {
          return (
            <a data-slot="button" href="#" data-test="link" className={buttonVariants({ variant: "link", className: ["text-muted-foreground", "font-bold"] })}>Learn more
                    </a>
          )
        }"
      `)
    })
  })

  describe("handles nested children", () => {
    test("preserves complex children content", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"
import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <Button asChild>
      <a href="#">
        Learn more <Icon />
      </a>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"
        import { buttonVariants } from "@/components/ui/button"

        export function Component() {
          return (
            <a data-slot="button" href="#" className={buttonVariants()}>Learn more <Icon /></a>
          )
        }"
      `)
    })
  })

  describe("link attributes and imports", () => {
    test("preserves static props and consumes Button style props", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import { Button } from "@/components/ui/button"

export function Component({ variant, outerClass, linkClass, handleClick, linkRef }) {
  return (
    <Button
      variant={variant}
      size="sm"
      id="cta"
      aria-label="Open dashboard"
      onClick={handleClick}
      ref={linkRef}
      className={outerClass}
      asChild
    >
      <a
        href="/dashboard"
        target="_blank"
        rel="noreferrer"
        data-track="dashboard"
        className={linkClass}
      >
        Dashboard
      </a>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import { buttonVariants } from "@/components/ui/button"

        export function Component({ variant, outerClass, linkClass, handleClick, linkRef }) {
          return (
            <a data-slot="button" id="cta" aria-label="Open dashboard" onClick={handleClick} ref={linkRef} href="/dashboard" target="_blank" rel="noreferrer" data-track="dashboard" className={buttonVariants({ variant: variant, size: "sm", className: [outerClass, linkClass] })}>Dashboard
                    </a>
          )
        }"
      `)
    })

    test("keeps Button imported when the file still uses it", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <>
      <Button>Save</Button>
      <Button asChild><a href="/docs">Docs</a></Button>
    </>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import { Button, buttonVariants } from "@/components/ui/button"

        export function Component() {
          return (
            <>
              <Button>Save</Button>
              <a data-slot="button" href="/docs" className={buttonVariants()}>Docs</a>
            </>
          )
        }"
      `)
    })

    test("reuses aliased imports and resolves an aliased Link", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import NextLink from "next/link"
import { Button as UiButton, buttonVariants as styles } from "@/components/ui/button"

export function Component() {
  return <UiButton asChild><NextLink href="/">Home</NextLink></UiButton>
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import NextLink from "next/link"
        import { buttonVariants as styles } from "@/components/ui/button"

        export function Component() {
          return <NextLink data-slot="button" href="/" className={styles()}>Home</NextLink>
        }"
      `)
    })

    test("recognizes Remix Link and NavLink exports", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import { Link, NavLink as RemixNavLink } from "@remix-run/react"
import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <>
      <Button asChild><Link to="/docs">Docs</Link></Button>
      <Button variant="outline" asChild><RemixNavLink to="/account">Account</RemixNavLink></Button>
    </>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import { Link, NavLink as RemixNavLink } from "@remix-run/react"
        import { buttonVariants } from "@/components/ui/button"

        export function Component() {
          return (
            <>
              <Link data-slot="button" to="/docs" className={buttonVariants()}>Docs</Link>
              <RemixNavLink data-slot="button" to="/account" className={buttonVariants({ variant: "outline" })}>Account</RemixNavLink>
            </>
          )
        }"
      `)
    })

    test("aliases buttonVariants when the local name is already used", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import { Button } from "@/components/ui/button"

const buttonVariants = "custom"

export function Component() {
  return <Button asChild><a href="/">Home</a></Button>
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import { buttonVariants as shadcnButtonVariants } from "@/components/ui/button"

        const buttonVariants = "custom"

        export function Component() {
          return <a data-slot="button" href="/" className={shadcnButtonVariants()}>Home</a>
        }"
      `)
    })

    test("keeps the link as owner with unknown parent spread props", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"

export function Component({ buttonProps, linkProps }) {
  return (
    <Button {...buttonProps} asChild>
      <a href="/docs" {...linkProps}>Docs</a>
    </Button>
  )
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain("function ButtonLink(")
      expect(output).toContain(
        '<ButtonLink {...buttonProps} render={<a href="/docs" {...linkProps} />}>Docs</ButtonLink>'
      )
      expect(output).not.toContain("<Button ")
    })

    test("uses a semantic helper for child spread props", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"

export function Component({ linkProps }) {
  return (
    <Button variant="outline" className="wide" asChild>
      <a href="/docs" {...linkProps}>Docs</a>
    </Button>
  )
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain("function ButtonLink(")
      expect(output).toContain(
        '<ButtonLink variant="outline" className="wide" render={<a href="/docs" {...linkProps} />}>Docs</ButtonLink>'
      )
      expect(output).toContain('state: { slot: "button" }')
    })

    test("preserves the Button slot used by ButtonGroup", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export function Component({ linkProps }) {
  return (
    <ButtonGroup>
      <Button asChild><a href="/docs">Docs</a></Button>
      <Button asChild><a href="/about" {...linkProps}>About</a></Button>
    </ButtonGroup>
  )
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain('<a data-slot="button" href="/docs"')
      expect(output).toContain('state: { slot: "button" }')
    })

    test("preserves composed handlers, styles, and refs", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"

export function Component({ parentClick, childClick, parentRef, childRef }) {
  return (
    <Button
      onClick={parentClick}
      style={{ color: "red" }}
      ref={parentRef}
      asChild
    >
      <a
        href="/docs"
        onClick={childClick}
        style={{ background: "blue" }}
        ref={childRef}
      >
        Docs
      </a>
    </Button>
  )
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain("function ButtonLink(")
      expect(output).toContain(
        'onClick={parentClick} style={{ color: "red" }} ref={parentRef}'
      )
      expect(output).toContain(
        'onClick={childClick} style={{ background: "blue" }} ref={childRef}'
      )
      expect(output).toContain("props: {")
      expect(output).toContain("render,")
      expect(output).toContain('state: { slot: "button" }')
    })

    test("emits a type-safe router-link helper", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ComponentProps {
  buttonProps: React.ComponentProps<"button">
  linkProps: React.ComponentProps<typeof Link>
  parentClick: React.MouseEventHandler<HTMLButtonElement>
  childClick: React.MouseEventHandler<HTMLAnchorElement>
  parentRef: React.Ref<HTMLButtonElement>
  childRef: React.Ref<HTMLAnchorElement>
}

export function Component({ buttonProps, linkProps, parentClick, childClick, parentRef, childRef }: ComponentProps) {
  return (
    <Button {...buttonProps} onClick={parentClick} ref={parentRef} asChild>
      <Link {...linkProps} href="/docs" onClick={childClick} ref={childRef}>Docs</Link>
    </Button>
  )
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(getGeneratedTypeScriptDiagnostics(output)).toEqual([])
    })

    test("preserves spread order and evaluates each expression once", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <Button variant="outline" {...getButtonProps()} size="sm" asChild>
      <a className="fixed" {...getLinkProps()} href="/docs">Docs</a>
    </Button>
  )
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain(
        '<ButtonLink variant="outline" {...getButtonProps()} size="sm" render={<a className="fixed" {...getLinkProps()} href="/docs" />}>Docs</ButtonLink>'
      )
      expect(output.match(/getButtonProps\(\)/g)).toHaveLength(1)
      expect(output.match(/getLinkProps\(\)/g)).toHaveLength(1)
    })
  })

  describe("link detection boundaries", () => {
    test("does not rewrite a local component named Link", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"

function Link({ children }) {
  return <span>{children}</span>
}

export function Component() {
  return <Button asChild><Link href="/docs">Docs</Link></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain(
        '<Button render={<Link href="/docs" />} nativeButton={false}>Docs</Button>'
      )
      expect(output).not.toContain("buttonVariants")
    })

    test("keeps Button behavior for an anchor without a link target", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"

export function Component() {
  return <Button asChild><a>Action</a></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain(
        "<Button render={<a />} nativeButton={false}>Action</Button>"
      )
      expect(output).not.toContain("buttonVariants")
    })

    test("keeps a spread-only anchor as the final element", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"

export function Component({ anchorProps }) {
  return <Button asChild><a {...anchorProps}>Action</a></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain("function ButtonLink(")
      expect(output).toContain(
        "<ButtonLink render={<a {...anchorProps} />}>Action</ButtonLink>"
      )
      expect(output).not.toContain("<Button ")
    })

    test("keeps a spread-only router link as the final element", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Component({ linkProps }) {
  return <Button asChild><Link {...linkProps}>Docs</Link></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain("function ButtonLink(")
      expect(output).toContain(
        "<ButtonLink render={<Link {...linkProps} />}>Docs</ButtonLink>"
      )
      expect(output).not.toContain("<Button ")
    })

    test("recognizes router links imported through a namespace", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import * as Router from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Component() {
  return <Button asChild><Router.Link to="/docs">Docs</Router.Link></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain(
        '<Router.Link data-slot="button" to="/docs" className={buttonVariants()}>Docs</Router.Link>'
      )
      expect(output).not.toContain("<Button ")
    })

    test("does not rewrite shadowed Button or Link bindings", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ShadowedButton(Button) {
  return <Button asChild><a href="/docs">Docs</a></Button>
}

export function ShadowedLink(Link) {
  return <Button asChild><Link href="/docs">Docs</Link></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain(
        '<Button render={<a href="/docs" />}>Docs</Button>'
      )
      expect(output).toContain(
        '<Button render={<Link href="/docs" />} nativeButton={false}>Docs</Button>'
      )
      expect(output).not.toContain("buttonVariants")
    })

    test("keeps generated helper component names capitalized", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"

const ButtonLink = "existing"

export function Component({ linkProps }) {
  return <Button asChild><a href="/docs" {...linkProps}>Docs</a></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain("function ButtonLink2(")
      expect(output).toContain(
        '<ButtonLink2 render={<a href="/docs" {...linkProps} />}>Docs</ButtonLink2>'
      )
      expect(output).not.toContain("<shadcnButtonLink")
    })

    test("removes Button-only props from a semantic link", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/components/ui/button"

export function Component() {
  return <Button disabled asChild><a href="/docs">Docs</a></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain("function ButtonLink(")
      expect(output).toContain(
        '<ButtonLink disabled render={<a href="/docs" />}>Docs</ButtonLink>'
      )
      expect(output).not.toContain("<a disabled")
      expect(output).toContain("Reflect.deleteProperty(linkProps, prop)")
      expect(output).not.toContain("<Button ")
    })

    test("recognizes an aliased UI Button for nativeButton", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button as UiButton } from "@/components/ui/button"

export function Component() {
  return <UiButton asChild><span>Action</span></UiButton>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain(
        "<UiButton render={<span />} nativeButton={false}>Action</UiButton>"
      )
    })

    test("does not inject buttonVariants into a third-party Button", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@acme/button"

export function Component() {
  return <Button asChild><a href="/docs">Docs</a></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain('import { Button } from "@acme/button"')
      expect(output).not.toContain("buttonVariants")
    })

    test("uses the configured UI alias for Button detection", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button } from "@/ui/button"

export function Component() {
  return <Button asChild><a href="/docs">Docs</a></Button>
}`,
          config: {
            ...testConfig,
            aliases: {
              ...testConfig.aliases,
              ui: "@/ui",
            },
          },
        },
        [transformAsChild]
      )

      expect(output).toContain('import { buttonVariants } from "@/ui/button"')
      expect(output).toContain(
        '<a data-slot="button" href="/docs" className={buttonVariants()}>Docs</a>'
      )
    })
  })

  describe("buttonVariants import handling", () => {
    test("converts an existing type-only import to a value import", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { Button, type buttonVariants } from "@/components/ui/button"

export function Component() {
  return <Button asChild><a href="/docs">Docs</a></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output).toContain(
        'import { buttonVariants } from "@/components/ui/button"'
      )
      expect(output).not.toContain("type buttonVariants")
    })

    test("cleans up a split Button import declaration", async () => {
      const output = await transform(
        {
          filename: "test.tsx",
          raw: `import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"

export function Component() {
  return <Button asChild><a href="/docs">Docs</a></Button>
}`,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(output.match(/from "@\/components\/ui\/button"/g)).toHaveLength(1)
      expect(output).not.toContain("{ Button }")
    })

    test("strips generated helper types for JSX projects", async () => {
      const output = await transform(
        {
          filename: "test.jsx",
          raw: `import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Component({ parentClick, childClick, parentRef, childRef }) {
  return (
    <Button {...getButtonProps()} onClick={parentClick} ref={parentRef} asChild>
      <Link {...getLinkProps()} to="/docs" onClick={childClick} ref={childRef}>Docs</Link>
    </Button>
  )
}`,
          config: {
            ...testConfig,
            tsx: false,
          },
          transformJsx: true,
        },
        [transformAsChild]
      )

      expect(output).toContain("function ButtonLink(")
      expect(output).toContain("onClick={parentClick}")
      expect(output).toContain("onClick={childClick}")
      expect(output).toContain("ref={parentRef}")
      expect(output).toContain("ref={childRef}")
      expect(output.match(/getButtonProps\(\)/g)).toHaveLength(1)
      expect(output.match(/getLinkProps\(\)/g)).toHaveLength(1)
      expect(output).not.toContain("type ButtonLinkProps")
      expect(output).not.toContain(": ButtonLinkProps")
      expect(output).not.toContain('mergeProps<"a">')
    })

    test("does not rewrite shadowed bindings in JSX projects", async () => {
      const output = await transform(
        {
          filename: "test.jsx",
          raw: `import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Component({ Button, Link }) {
  return <Button asChild><Link href="/docs">Docs</Link></Button>
}`,
          config: {
            ...testConfig,
            tsx: false,
          },
          transformJsx: true,
        },
        [transformAsChild]
      )

      expect(output).toContain(
        '<Button render={<Link href="/docs" />}>Docs</Button>'
      )
      expect(output).not.toContain("buttonVariants")
      expect(output).not.toContain("ButtonLink")
    })
  })

  describe("self-closing child element", () => {
    test("handles self-closing child with no children", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <TooltipTrigger asChild>
      <InputGroupButton size="icon-xs" />
    </TooltipTrigger>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <TooltipTrigger render={<InputGroupButton size="icon-xs" />}></TooltipTrigger>
          )
        }"
      `)
    })
  })

  describe("non-base style", () => {
    test("does not transform when style is not base-*", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DialogTrigger asChild>
      <Button>Open</Button>
    </DialogTrigger>
  )
}`,
            config: {
              ...testConfig,
              style: "new-york",
            },
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DialogTrigger asChild>
              <Button>Open</Button>
            </DialogTrigger>
          )
        }"
      `)
    })
  })

  describe("multiple asChild elements", () => {
    test("transforms multiple asChild elements in same file", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <div>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
    </div>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <div>
              <DialogTrigger render={<Button variant="outline" />}>Edit Profile</DialogTrigger>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            </div>
          )
        }"
      `)
    })
  })

  describe("nested asChild", () => {
    test("transforms inner asChild first, then outer", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Collapsible asChild>
      <SidebarMenuButton asChild>
        <a href="#">Home</a>
      </SidebarMenuButton>
    </Collapsible>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <Collapsible render={<SidebarMenuButton render={<a href="#" />} />}>Home</Collapsible>
          )
        }"
      `)
    })

    test("transforms nested with sibling asChild elements", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <div>
      <Collapsible asChild>
        <SidebarMenuButton asChild>
          <a href="#">Home</a>
        </SidebarMenuButton>
      </Collapsible>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
    </div>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <div>
              <Collapsible render={<SidebarMenuButton render={<a href="#" />} />}>Home</Collapsible>
              <DialogTrigger render={<Button variant="outline" />}>Edit</DialogTrigger>
            </div>
          )
        }"
      `)
    })

    test("transforms nested with self-closing inner child", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Collapsible asChild>
      <SidebarMenuButton asChild>
        <Icon className="size-4" />
      </SidebarMenuButton>
    </Collapsible>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <Collapsible render={<SidebarMenuButton render={<Icon className="size-4" />} />}></Collapsible>
          )
        }"
      `)
    })

    test("transforms triple-nested asChild", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <TooltipTrigger asChild>
      <Collapsible asChild>
        <SidebarMenuButton asChild>
          <a href="#">Home</a>
        </SidebarMenuButton>
      </Collapsible>
    </TooltipTrigger>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <TooltipTrigger render={<Collapsible render={<SidebarMenuButton render={<a href="#" />} />} />}>Home</TooltipTrigger>
          )
        }"
      `)
    })
  })

  describe("idempotency", () => {
    test("running twice produces same output", async () => {
      const input = `import * as React from "react"

export function Component() {
  return (
    <DialogTrigger asChild>
      <Button variant="outline">Edit Profile</Button>
    </DialogTrigger>
  )
}`

      const firstRun = await transform(
        {
          filename: "test.tsx",
          raw: input,
          config: testConfig,
        },
        [transformAsChild]
      )

      const secondRun = await transform(
        {
          filename: "test.tsx",
          raw: firstRun,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(secondRun).toBe(firstRun)
    })
  })
})

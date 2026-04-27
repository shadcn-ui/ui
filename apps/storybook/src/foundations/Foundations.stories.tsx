import type { Meta, StoryObj } from "@storybook/react-vite"

const colorVars = [
  { group: "Surface", names: ["surface-default", "surface-muted"] },
  {
    group: "Text",
    names: [
      "text-default",
      "text-onPrimary",
      "text-onDanger",
      "text-muted",
      "text-disabled",
    ],
  },
  {
    group: "Action / Primary",
    names: [
      "action-primary-default",
      "action-primary-hover",
      "action-primary-active",
    ],
  },
  {
    group: "Action / Secondary",
    names: [
      "action-secondary-default",
      "action-secondary-hover",
      "action-secondary-active",
      "action-secondary-text",
    ],
  },
  {
    group: "Action / Danger",
    names: [
      "action-danger-default",
      "action-danger-hover",
      "action-danger-active",
    ],
  },
  { group: "Border", names: ["border-default", "border-strong"] },
  { group: "Focus", names: ["focus-ring"] },
] as const

const radii = [
  { name: "radius-sm", token: "--lead-radius-sm" },
  { name: "radius-md", token: "--lead-radius-md" },
] as const

const spacing = [
  { name: "space-1", token: "--lead-space-1" },
  { name: "space-2", token: "--lead-space-2" },
  { name: "space-3", token: "--lead-space-3" },
  { name: "space-4", token: "--lead-space-4" },
  { name: "space-5", token: "--lead-space-5" },
] as const

const typeScale = [
  { name: "font-size-sm", token: "--lead-font-size-sm" },
  { name: "font-size-md", token: "--lead-font-size-md" },
  { name: "font-size-lg", token: "--lead-font-size-lg" },
] as const

const sectionStyle: React.CSSProperties = {
  fontFamily: "var(--lead-font-family-sans)",
  marginBottom: "var(--lead-space-5)",
}

const headingStyle: React.CSSProperties = {
  fontSize: "var(--lead-font-size-lg)",
  fontWeight: 600,
  marginBottom: "var(--lead-space-3)",
}

const subheadingStyle: React.CSSProperties = {
  fontSize: "var(--lead-font-size-md)",
  fontWeight: 600,
  marginTop: "var(--lead-space-4)",
  marginBottom: "var(--lead-space-2)",
  color: "var(--lead-color-text-muted)",
}

function Swatch({ name }: { name: string }) {
  const token = `--lead-color-${name}`
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--lead-space-3)",
        padding: "var(--lead-space-2)",
        borderRadius: "var(--lead-radius-sm)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--lead-radius-sm)",
          background: `var(${token})`,
          border: "1px solid var(--lead-color-border-default)",
          flex: "0 0 auto",
        }}
      />
      <code style={{ fontSize: "var(--lead-font-size-sm)" }}>{token}</code>
    </div>
  )
}

function RadiusSample({ name, token }: { name: string; token: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--lead-space-3)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 56,
          height: 32,
          borderRadius: `var(${token})`,
          background: "var(--lead-color-action-primary-default)",
        }}
      />
      <code style={{ fontSize: "var(--lead-font-size-sm)" }}>
        {`var(${token})`}
      </code>
      <span
        style={{
          fontSize: "var(--lead-font-size-sm)",
          color: "var(--lead-color-text-muted)",
        }}
      >
        {name}
      </span>
    </div>
  )
}

function SpacingSample({ name, token }: { name: string; token: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--lead-space-3)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: `var(${token})`,
          height: 16,
          background: "var(--lead-color-action-primary-default)",
          borderRadius: "var(--lead-radius-sm)",
          flex: "0 0 auto",
        }}
      />
      <code style={{ fontSize: "var(--lead-font-size-sm)" }}>
        {`var(${token})`}
      </code>
      <span
        style={{
          fontSize: "var(--lead-font-size-sm)",
          color: "var(--lead-color-text-muted)",
        }}
      >
        {name}
      </span>
    </div>
  )
}

function TypeSample({ name, token }: { name: string; token: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "var(--lead-space-3)",
      }}
    >
      <span style={{ fontSize: `var(${token})` }}>The quick brown fox</span>
      <code style={{ fontSize: "var(--lead-font-size-sm)" }}>
        {`var(${token})`}
      </code>
      <span
        style={{
          fontSize: "var(--lead-font-size-sm)",
          color: "var(--lead-color-text-muted)",
        }}
      >
        {name}
      </span>
    </div>
  )
}

function FoundationsView() {
  return (
    <div style={{ padding: "var(--lead-space-5)" }}>
      <p
        style={{
          ...sectionStyle,
          color: "var(--lead-color-text-muted)",
          fontSize: "var(--lead-font-size-sm)",
        }}
      >
        These are the placeholder Lead token variables currently bundled in{" "}
        <code>@leadbank/ui/styles.css</code>. They will be replaced by the
        generated output of <code>@leadbank/design-tokens-cli</code> once its{" "}
        <code>build</code> command lands; the variable names will not change.
      </p>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Color</h2>
        {colorVars.map((group) => (
          <div key={group.group}>
            <h3 style={subheadingStyle}>{group.group}</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--lead-space-2)",
              }}
            >
              {group.names.map((name) => (
                <Swatch key={name} name={name} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Radius</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--lead-space-3)",
          }}
        >
          {radii.map((r) => (
            <RadiusSample key={r.name} name={r.name} token={r.token} />
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Spacing</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--lead-space-3)",
          }}
        >
          {spacing.map((s) => (
            <SpacingSample key={s.name} name={s.name} token={s.token} />
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Typography</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--lead-space-3)",
          }}
        >
          {typeScale.map((t) => (
            <TypeSample key={t.name} name={t.name} token={t.token} />
          ))}
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof FoundationsView> = {
  title: "Foundations/Tokens",
  component: FoundationsView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visual catalog of the placeholder Lead CSS variables shipped today. Replaced by generated output once the token CLI's `build` command lands.",
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof FoundationsView>

export const All: Story = {}

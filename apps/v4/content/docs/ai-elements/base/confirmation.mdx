---
title: Confirmation
description: Asks for approval before a tool runs.
base: base
component: true
---

<ComponentPreview
  styleName="base-rhea"
  name="confirmation-demo"
  previewClassName="h-auto"
/>

Confirmation asks the person for a yes or no before a tool runs. The question is an [Item](/docs/components/base/item) with Deny and Approve buttons. Once the person answers, the call becomes a [Tool](/docs/ai-elements/base/tool) line.

## Installation

Confirmation is built with the [Item](/docs/components/base/item) and [Button](/docs/components/base/button) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add item button
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add item button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="item"
  title="components/ui/item.tsx"
  styleName="base-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
<Item variant="outline" size="sm">
  <ItemMedia variant="icon">
    <TerminalIcon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Run {part.input.command}?</ItemTitle>
    <ItemDescription>The command runs in this project.</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button size="sm" variant="outline" onClick={deny}>
      Deny
    </Button>
    <Button size="sm" onClick={approve}>
      Approve
    </Button>
  </ItemActions>
</Item>
```

## AI SDK

While the part is `approval-requested`, answer with the approval id. Pass `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses` so the chat continues once every approval has an answer.

```tsx showLineNumbers
addToolApprovalResponse({
  id: part.approval.id,
  approved: true,
})
```

```tsx showLineNumbers
useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
})
```

Approve streams the tool output. Deny streams `output-denied`. Either way, the part becomes a Tool line.

See [Tool](/docs/ai-elements/base/tool#approval).

## AI SDK Helper

To script an approval with [`createChat`](/docs/helpers/ai-sdk), set `needsApproval` on the tool. The `output` streams after approval, and the next agent turn reads `toolCall.approved`.

```ts showLineNumbers
const chat = createChat()
  .user("Clean up the build folder.")
  .assistant(({ writer }) => {
    writer.tool("runCommand", {
      input: { command: "rm -rf dist" },
      needsApproval: true,
      output: { stdout: "" },
    })
  })
  .assistant(({ writer, toolCall }) => {
    writer.text(
      toolCall?.approved
        ? "Removed the dist folder."
        : "Okay, I left the dist folder in place."
    )
  })
```

## Migrating from AI SDK Elements

If you added Confirmation from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/confirmation.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Item and Button. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/confirmation.tsx from AI SDK Elements to the shadcn/ui Item and Button components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add item button
2. Read https://ui.shadcn.com/docs/ai-elements/base/confirmation.md and build Confirmation the same way.
3. Rebuild each part:
   - Confirmation renders an Item with variant="outline" and size="sm", instead of an Alert. Keep the approval and state props and the context they feed.
   - ConfirmationTitle renders an ItemContent with an ItemTitle.
   - ConfirmationActions renders an ItemActions.
   - ConfirmationAction renders a Button with size="sm".
   - Keep ConfirmationRequest, ConfirmationAccepted and ConfirmationRejected as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```

<script lang="ts">
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as Card from "$lib/registry/ui/card/index.js";
	import * as Select from "$lib/registry/ui/select/index.js";
	import { Input } from "$lib/registry/ui/input/index.js";
	import { Label } from "$lib/registry/ui/label/index.js";

	const frameworks = [
		{
			value: "sveltekit",
			label: "SvelteKit",
		},
		{
			value: "next",
			label: "Next.js",
		},
		{
			value: "astro",
			label: "Astro",
		},
		{
			value: "nuxt",
			label: "Nuxt.js",
		},
	];

	let framework = $state("");

	const selectedFramework = $derived(
		frameworks.find((f) => f.value === framework)?.label ?? "Select a framework"
	);
</script>

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title>Create project</Card.Title>
		<Card.Description>Deploy your new project in one-click.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="name">Name</Label>
					<Input id="name" placeholder="Name of your project" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="framework">Framework</Label>
					<Select.Root type="single" bind:value={framework}>
						<Select.Trigger id="framework">
							{selectedFramework}
						</Select.Trigger>
						<Select.Content>
							{#each frameworks as { value, label } (value)}
								<Select.Item {value} {label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline">Cancel</Button>
		<Button>Deploy</Button>
	</Card.Footer>
</Card.Root>

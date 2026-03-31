<script lang="ts" module>
	import { z } from "zod";

	const languages = [
		{ label: "English", value: "en" },
		{ label: "French", value: "fr" },
		{ label: "German", value: "de" },
		{ label: "Spanish", value: "es" },
		{ label: "Portuguese", value: "pt" },
		{ label: "Russian", value: "ru" },
		{ label: "Japanese", value: "ja" },
		{ label: "Korean", value: "ko" },
		{ label: "Chinese", value: "zh" },
	] as const;

	const formSchema = z.object({
		language: z.enum(["en", "fr", "de", "es", "pt", "ru", "ja", "ko", "zh"]),
	});
</script>

<script lang="ts">
	import { defaults, superForm } from "sveltekit-superforms";
	import { tick } from "svelte";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import { zod4 } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import { useId } from "bits-ui";
	import * as Form from "$lib/registry/ui/form/index.js";
	import * as Popover from "$lib/registry/ui/popover/index.js";
	import * as Command from "$lib/registry/ui/command/index.js";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "$lib/registry/ui/button/index.js";

	const form = superForm(defaults(zod4(formSchema)), {
		validators: zod4(formSchema),
		SPA: true,
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
			} else {
				toast.error("Please fix the errors in the form.");
			}
		},
	});

	const { form: formData, enhance } = form;

	let open = false;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
	const triggerId = useId();
</script>

<form method="POST" class="space-y-6" use:enhance>
	<Form.Field {form} name="language" class="flex flex-col">
		<Popover.Root bind:open>
			<Form.Control id={triggerId}>
				{#snippet children({ props })}
					<Form.Label>Language</Form.Label>
					<Popover.Trigger
						class={cn(
							buttonVariants({ variant: "outline" }),
							"w-[200px] justify-between",
							!$formData.language && "text-muted-foreground"
						)}
						role="combobox"
						{...props}
					>
						{languages.find((f) => f.value === $formData.language)?.label ??
							"Select language"}
						<ChevronsUpDownIcon class="opacity-50" />
					</Popover.Trigger>
					<input hidden value={$formData.language} name={props.name} />
				{/snippet}
			</Form.Control>
			<Popover.Content class="w-[200px] p-0">
				<Command.Root>
					<Command.Input autofocus placeholder="Search language..." class="h-9" />
					<Command.Empty>No language found.</Command.Empty>
					<Command.Group value="languages">
						{#each languages as language (language.value)}
							<Command.Item
								value={language.label}
								onSelect={() => {
									$formData.language = language.value;
									closeAndFocusTrigger(triggerId);
								}}
							>
								{language.label}
								<CheckIcon
									class={cn(
										"ms-auto",
										language.value !== $formData.language && "text-transparent"
									)}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
		<Form.Description>
			This is the language that will be used in the dashboard.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>

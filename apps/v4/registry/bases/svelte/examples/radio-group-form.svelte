<script lang="ts" module>
	import { z } from "zod";

	const formSchema = z.object({
		type: z.enum(["all", "mentions", "none"]),
	});
</script>

<script lang="ts">
	import { defaults, superForm } from "sveltekit-superforms";
	import { zod4 } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import * as Form from "$lib/registry/ui/form/index.js";
	import * as RadioGroup from "$lib/registry/ui/radio-group/index.js";

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
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
	<Form.Fieldset {form} name="type" class="space-y-3">
		<Form.Legend>Notify me about...</Form.Legend>
		<RadioGroup.Root bind:value={$formData.type} class="flex flex-col space-y-1" name="type">
			<div class="flex items-center space-y-0 space-x-3">
				<Form.Control>
					{#snippet children({ props })}
						<RadioGroup.Item value="all" {...props} />
						<Form.Label class="font-normal">All new messages</Form.Label>
					{/snippet}
				</Form.Control>
			</div>
			<div class="flex items-center space-y-0 space-x-3">
				<Form.Control>
					{#snippet children({ props })}
						<RadioGroup.Item value="mentions" {...props} />
						<Form.Label class="font-normal">Direction messages and mentions</Form.Label>
					{/snippet}
				</Form.Control>
			</div>
			<div class="flex items-center space-y-0 space-x-3">
				<Form.Control>
					{#snippet children({ props })}
						<RadioGroup.Item value="none" {...props} />
						<Form.Label class="font-normal">Nothing</Form.Label>
					{/snippet}
				</Form.Control>
			</div>
		</RadioGroup.Root>
		<Form.FieldErrors />
	</Form.Fieldset>
	<Form.Button>Submit</Form.Button>
</form>

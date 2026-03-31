<script lang="ts" module>
	import { z } from "zod";
	const formSchema = z.object({
		mobile: z.boolean().default(false),
	});
</script>

<script lang="ts">
	import { defaults, superForm } from "sveltekit-superforms";
	import { zod4 } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import * as Form from "$lib/registry/ui/form/index.js";
	import { Checkbox } from "$lib/registry/ui/checkbox/index.js";

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

<form method="POST" class="space-y-6" use:enhance>
	<Form.Field
		{form}
		name="mobile"
		class="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4"
	>
		<Form.Control>
			{#snippet children({ props })}
				<Checkbox {...props} bind:checked={$formData.mobile} />
				<div class="space-y-1 leading-none">
					<Form.Label>Use different settings for my mobile devices</Form.Label>
					<Form.Description>
						You can manage your mobile notifications in the <a href="/examples/forms"
							>mobile settings</a
						> page.
					</Form.Description>
				</div>
			{/snippet}
		</Form.Control>
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>

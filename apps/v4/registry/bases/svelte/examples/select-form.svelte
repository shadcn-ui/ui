<script lang="ts" module>
	import { z } from "zod";

	const formSchema = z.object({
		email: z.email({ message: "Please select an email to display" }),
	});
</script>

<script lang="ts">
	import { defaults, superForm } from "sveltekit-superforms";
	import { zod4 } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import * as Form from "$lib/registry/ui/form/index.js";
	import * as Select from "$lib/registry/ui/select/index.js";

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
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Select.Root type="single" bind:value={$formData.email} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.email ? $formData.email : "Select a verified email to display"}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="m@example.com" label="m@example.com" />
						<Select.Item value="m@google.com" label="m@google.com" />
						<Select.Item value="m@support.com" label="m@support.com" />
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>
			You can manage email address in your <a href="/examples/forms">email settings</a>.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>

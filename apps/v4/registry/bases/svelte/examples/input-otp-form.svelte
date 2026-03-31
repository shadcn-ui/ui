<script lang="ts" module>
	import { z } from "zod";
	const formSchema = z.object({
		pin: z.string().min(6, {
			message: "Your one-time password must be at least 6 characters.",
		}),
	});
</script>

<script lang="ts">
	import { defaults, superForm } from "sveltekit-superforms";
	import { zod4 } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import * as InputOTP from "$lib/registry/ui/input-otp/index.js";
	import * as Form from "$lib/registry/ui/form/index.js";

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
	<Form.Field {form} name="pin">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>One-Time Password</Form.Label>
				<InputOTP.Root maxlength={6} {...props} bind:value={$formData.pin}>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>Please enter the one-time password sent to your phone.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>

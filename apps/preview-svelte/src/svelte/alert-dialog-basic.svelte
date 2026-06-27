<script lang="ts">
	import * as AlertDialog from "@/svelte-ui/alert-dialog/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>
		Show Dialog
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove
				your data from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

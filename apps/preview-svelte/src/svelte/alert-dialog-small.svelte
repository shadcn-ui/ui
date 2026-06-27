<script lang="ts">
	import * as AlertDialog from "@/svelte-ui/alert-dialog/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>
		Show Dialog
	</AlertDialog.Trigger>
	<AlertDialog.Content size="sm">
		<AlertDialog.Header>
			<AlertDialog.Title>Allow accessory to connect?</AlertDialog.Title>
			<AlertDialog.Description>
				Do you want to allow the USB accessory to connect to this device?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Don't allow</AlertDialog.Cancel>
			<AlertDialog.Action>Allow</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

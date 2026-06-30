<script lang="ts">
	import DeleteIcon from "~icons/ms/delete";
	import * as AlertDialog from "@/svelte-ui/alert-dialog/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
		Delete Chat
	</AlertDialog.Trigger>
	<AlertDialog.Content size="sm">
		<AlertDialog.Header>
			<AlertDialog.Media class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
				<DeleteIcon />
			</AlertDialog.Media>
			<AlertDialog.Title>Delete chat?</AlertDialog.Title>
			<AlertDialog.Description>
				This will permanently delete this chat conversation. View
				<a href="#">Settings</a> delete any memories saved during this chat.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel variant="outline">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action variant="destructive">Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

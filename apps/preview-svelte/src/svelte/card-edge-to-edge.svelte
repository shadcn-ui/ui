<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Card from "@/svelte-ui/card/index.js";
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title>Terms of Service</Card.Title>
		<Card.Description>Review the terms before accepting the agreement.</Card.Description>
	</Card.Header>
	<Card.Content class="-mb-(--card-spacing)">
		<div class="-mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
			<p>
				These terms govern your use of the workspace, including access to
				shared documents, project files, and collaboration tools.
			</p>
			<p>
				You are responsible for the content you upload and for ensuring that
				your team has the appropriate permissions to view or edit it.
			</p>
			<p>
				We may update features or limits as the service evolves. When those
				changes materially affect your workflow, we will notify your
				workspace administrators.
			</p>
			<p>
				By continuing, you agree to keep your account credentials secure and
				to follow your organization's acceptable use policies.
			</p>
		</div>
	</Card.Content>
	<Card.Footer class="justify-end gap-2">
		<Button variant="outline">Decline</Button>
		<Button>Accept</Button>
	</Card.Footer>
</Card.Root>

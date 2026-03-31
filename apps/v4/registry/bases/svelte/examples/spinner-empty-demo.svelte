<script lang="ts">
	import * as Empty from "$lib/registry/ui/empty/index.js";
	import { Spinner } from "$lib/registry/ui/spinner/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
</script>

<Empty.Root class="w-full border md:p-6">
	<Empty.Header>
		<Empty.Media variant="icon">
			<Spinner />
		</Empty.Media>
		<Empty.Title>Processing your request</Empty.Title>
		<Empty.Description>
			Please wait while we process your request. Do not refresh the page.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button variant="outline" size="sm">Cancel</Button>
	</Empty.Content>
</Empty.Root>

<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Progress } from "@/svelte-ui/progress/index.js";
</script>

<Field.Field class="w-full max-w-sm">
	<Field.Label for="progress-upload">
		<span>Upload progress</span>
		<span class="ml-auto">66%</span>
	</Field.Label>
	<Progress value={66} id="progress-upload" />
</Field.Field>

<script lang="ts">
	import * as RadioGroup from "$lib/registry/ui/radio-group/index.js";
	import { Label } from "$lib/registry/ui/label/index.js";
</script>

<RadioGroup.Root value="comfortable">
	<div class="flex items-center space-x-2">
		<RadioGroup.Item value="default" id="r1" />
		<Label for="r1">Default</Label>
	</div>
	<div class="flex items-center space-x-2">
		<RadioGroup.Item value="comfortable" id="r2" />
		<Label for="r2">Comfortable</Label>
	</div>
	<div class="flex items-center space-x-2">
		<RadioGroup.Item value="compact" id="r3" />
		<Label for="r3">Compact</Label>
	</div>
</RadioGroup.Root>

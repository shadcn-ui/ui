<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Progress } from "@/svelte-ui/progress/index.js";
</script>

<Field.Field class="w-full max-w-sm" dir="rtl">
	<Field.Label for="progress-upload-rtl">
		<span>تقدم الرفع</span>
		<span class="ms-auto">٦٦%</span>
	</Field.Label>
	<Progress value={66} id="progress-upload-rtl" class="rtl:rotate-180" />
</Field.Field>

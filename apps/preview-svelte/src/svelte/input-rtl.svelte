<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
</script>

<Field.Field dir="rtl">
	<Field.Label for="input-rtl-api-key">مفتاح API</Field.Label>
	<Input id="input-rtl-api-key" type="password" placeholder="sk-..." dir="rtl" />
	<Field.Description>مفتاح API الخاص بك مشفر ومخزن بأمان.</Field.Description>
</Field.Field>

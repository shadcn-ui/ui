<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Textarea } from "@/svelte-ui/textarea/index.js";
</script>

<Field.Field class="w-full max-w-xs" dir="rtl">
	<Field.Label for="feedback" dir="rtl">التعليقات</Field.Label>
	<Textarea
		id="feedback"
		placeholder="تعليقاتك تساعدنا على التحسين..."
		dir="rtl"
		rows={4}
	/>
	<Field.Description dir="rtl">شاركنا أفكارك حول خدمتنا.</Field.Description>
</Field.Field>

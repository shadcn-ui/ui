<script lang="ts">
	import * as NativeSelect from "@/svelte-ui/native-select/index.js";
</script>

<NativeSelect.Root dir="rtl">
	<NativeSelect.Option value="">اختر الحالة</NativeSelect.Option>
	<NativeSelect.Option value="todo">مهام</NativeSelect.Option>
	<NativeSelect.Option value="in-progress">قيد التنفيذ</NativeSelect.Option>
	<NativeSelect.Option value="done">منجز</NativeSelect.Option>
	<NativeSelect.Option value="cancelled">ملغي</NativeSelect.Option>
</NativeSelect.Root>

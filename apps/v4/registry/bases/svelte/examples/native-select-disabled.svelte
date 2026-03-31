<script lang="ts">
	import * as NativeSelect from "$lib/registry/ui/native-select/index.js";
</script>

<NativeSelect.Root disabled>
	<NativeSelect.Option value="">Select priority</NativeSelect.Option>
	<NativeSelect.Option value="low">Low</NativeSelect.Option>
	<NativeSelect.Option value="medium">Medium</NativeSelect.Option>
	<NativeSelect.Option value="high">High</NativeSelect.Option>
	<NativeSelect.Option value="critical">Critical</NativeSelect.Option>
</NativeSelect.Root>

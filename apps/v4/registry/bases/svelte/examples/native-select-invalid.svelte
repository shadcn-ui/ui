<script lang="ts">
	import * as NativeSelect from "$lib/registry/ui/native-select/index.js";
</script>

<NativeSelect.Root aria-invalid="true">
	<NativeSelect.Option value="">Select role</NativeSelect.Option>
	<NativeSelect.Option value="admin">Admin</NativeSelect.Option>
	<NativeSelect.Option value="editor">Editor</NativeSelect.Option>
	<NativeSelect.Option value="viewer">Viewer</NativeSelect.Option>
	<NativeSelect.Option value="guest">Guest</NativeSelect.Option>
</NativeSelect.Root>

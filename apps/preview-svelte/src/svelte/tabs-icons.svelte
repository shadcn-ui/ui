<script lang="ts">
	import IconAppWindow from "~icons/ms/web_asset";
	import IconCode from "~icons/ms/code";
	import * as Tabs from "@/svelte-ui/tabs/index.js";
</script>

<Tabs.Root value="preview">
	<Tabs.List>
		<Tabs.Trigger value="preview">
			<IconAppWindow />
			Preview
		</Tabs.Trigger>
		<Tabs.Trigger value="code">
			<IconCode />
			Code
		</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>

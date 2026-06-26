<script lang="ts">
	import SunIcon from "~icons/ms/light_mode";
	import MoonIcon from "~icons/ms/dark_mode";

	import { toggleMode } from "mode-watcher";
	import { Button } from "@/svelte-ui/button/index.js";
</script>

<Button onclick={toggleMode} variant="outline" size="icon">
	<SunIcon
		class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
	/>
	<MoonIcon
		class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>

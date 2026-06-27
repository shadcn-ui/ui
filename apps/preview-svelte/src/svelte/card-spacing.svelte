<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
	import { Label } from "@/svelte-ui/label/index.js";
	import * as Card from "@/svelte-ui/card/index.js";
	import * as ToggleGroup from "@/svelte-ui/toggle-group/index.js";

	const spacingOptions = [
		{ className: "[--card-spacing:--spacing(4)]", label: "16px", value: "4" },
		{ className: "[--card-spacing:--spacing(5)]", label: "20px", value: "5" },
		{ className: "[--card-spacing:--spacing(6)]", label: "24px", value: "6" },
		{ className: "[--card-spacing:--spacing(8)]", label: "32px", value: "8" },
	];

	let spacing = $state("4");

	const selectedSpacing = $derived(
		spacingOptions.find((option) => option.value === spacing)
	);
</script>

<div class="mx-auto grid w-full max-w-sm gap-4">
	<ToggleGroup.Root
		type="single"
		value={spacing}
		onValueChange={(value) => {
			if (value) spacing = value;
		}}
		variant="outline"
		size="sm"
		class="justify-center"
	>
		{#each spacingOptions as option (option.value)}
			<ToggleGroup.Item value={option.value}>{option.label}</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
	<Card.Root class={selectedSpacing?.className}>
		<Card.Header>
			<Card.Title>Login to your account</Card.Title>
			<Card.Description>Enter your email below to login to your account</Card.Description>
			<Card.Action>
				<Button variant="link">Sign Up</Button>
			</Card.Action>
		</Card.Header>
		<Card.Content>
			<form>
				<div class="flex flex-col gap-6">
					<div class="grid gap-2">
						<Label for="email-spacing">Email</Label>
						<Input id="email-spacing" type="email" placeholder="m@example.com" required />
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password-spacing">Password</Label>
							<a
								href="#"
								class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
							>
								Forgot your password?
							</a>
						</div>
						<Input id="password-spacing" type="password" required />
					</div>
				</div>
			</form>
		</Card.Content>
		<Card.Footer class="flex-col gap-2">
			<Button type="submit" class="w-full">Login</Button>
			<Button variant="outline" class="w-full">Login with Google</Button>
		</Card.Footer>
	</Card.Root>
</div>

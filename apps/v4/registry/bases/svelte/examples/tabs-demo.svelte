<script lang="ts">
	import * as Tabs from "$lib/registry/ui/tabs/index.js";
	import * as Card from "$lib/registry/ui/card/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import { Input } from "$lib/registry/ui/input/index.js";
	import { Label } from "$lib/registry/ui/label/index.js";
</script>

<div class="-mb-4 flex w-full max-w-sm flex-col gap-6">
	<Tabs.Root value="account">
		<Tabs.List>
			<Tabs.Trigger value="account">Account</Tabs.Trigger>
			<Tabs.Trigger value="password">Password</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="account">
			<Card.Root>
				<Card.Header>
					<Card.Title>Account</Card.Title>
					<Card.Description>
						Make changes to your account here. Click save when you&apos;re done.
					</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-6">
					<div class="grid gap-3">
						<Label for="tabs-demo-name">Name</Label>
						<Input id="tabs-demo-name" value="Pedro Duarte" />
					</div>
					<div class="grid gap-3">
						<Label for="tabs-demo-username">Username</Label>
						<Input id="tabs-demo-username" value="@peduarte" />
					</div>
				</Card.Content>
				<Card.Footer>
					<Button>Save changes</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="password">
			<Card.Root>
				<Card.Header>
					<Card.Title>Password</Card.Title>
					<Card.Description>
						Change your password here. After saving, you&apos;ll be logged out.
					</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-6">
					<div class="grid gap-3">
						<Label for="tabs-demo-current">Current password</Label>
						<Input id="tabs-demo-current" type="password" />
					</div>
					<div class="grid gap-3">
						<Label for="tabs-demo-new">New password</Label>
						<Input id="tabs-demo-new" type="password" />
					</div>
				</Card.Content>
				<Card.Footer>
					<Button>Save password</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>

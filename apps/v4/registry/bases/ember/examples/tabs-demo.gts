import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';

<template>
  <div class="flex w-full max-w-sm flex-col gap-6">
    <Tabs @defaultValue="account">
      <TabsList>
        <TabsTrigger @value="account">Account</TabsTrigger>
        <TabsTrigger @value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent @value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent @class="grid gap-6">
            <div class="grid gap-3">
              <Label for="tabs-demo-name">Name</Label>
              <Input id="tabs-demo-name" value="Pedro Duarte" />
            </div>
            <div class="grid gap-3">
              <Label for="tabs-demo-username">Username</Label>
              {{! template-lint-disable no-potential-path-strings }}
              <Input id="tabs-demo-username" value="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent @value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent @class="grid gap-6">
            <div class="grid gap-3">
              <Label for="tabs-demo-current">Current password</Label>
              <Input id="tabs-demo-current" type="password" />
            </div>
            <div class="grid gap-3">
              <Label for="tabs-demo-new">New password</Label>
              <Input id="tabs-demo-new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

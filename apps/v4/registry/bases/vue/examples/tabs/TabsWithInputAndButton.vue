<script setup lang="ts">
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
</script>

<template>
  <Tabs default-value="overview" class="mx-auto w-full max-w-lg">
    <div class="flex items-center gap-4">
      <TabsList>
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics">
          Analytics
        </TabsTrigger>
      </TabsList>
      <div class="ml-auto flex items-center gap-2">
        <Input placeholder="Search..." class="w-44" />
        <Button>Action</Button>
      </div>
    </div>
    <div class="style-nova:p-4 style-vega:p-6 style-maia:p-6 style-mira:p-4 style-lyra:p-4 style-nova:rounded-lg style-vega:rounded-lg style-maia:rounded-xl style-mira:rounded-md style-lyra:rounded-none border">
      <TabsContent value="overview">
        View your dashboard metrics and key performance indicators.
      </TabsContent>
      <TabsContent value="analytics">
        Detailed analytics and insights about your data.
      </TabsContent>
      <TabsContent value="reports">
        Generate and view custom reports.
      </TabsContent>
    </div>
  </Tabs>
</template>

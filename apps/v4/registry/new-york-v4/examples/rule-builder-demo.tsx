"use client"

import * as React from "react"

import { toast } from "@/registry/new-york-v4/hooks/use-toast"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  defaultRuleFields,
  defaultRuleOperators,
  RuleBuilder,
  type RuleGroup,
} from "@/registry/new-york-v4/ui/rule-builder"

export default function RuleBuilderDemo() {
  const [ruleGroup, setRuleGroup] = React.useState<RuleGroup>({
    id: "root",
    condition: "and",
    rules: [
      {
        id: "rule-1",
        fieldId: "age",
        operatorId: "greaterThan",
        value: 18,
      },
      {
        id: "rule-2",
        fieldId: "city",
        operatorId: "equals",
        value: "北京",
      },
    ],
  })

  const handleSubmit = () => {
    toast({
      title: "规则已提交",
      description: JSON.stringify(ruleGroup, null, 2),
      variant: "default",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>规则构建器</CardTitle>
      </CardHeader>
      <CardContent>
        <RuleBuilder
          fields={defaultRuleFields}
          operators={defaultRuleOperators}
          value={ruleGroup}
          onChange={setRuleGroup}
          className="space-y-4"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>提交规则</Button>
      </CardFooter>
    </Card>
  )
}

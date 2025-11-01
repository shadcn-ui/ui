import * as React from "react"
import { GripVerticalIcon, MinusIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Separator } from "@/registry/new-york-v4/ui/separator"

// Types
export type RuleField = {
  id: string
  name: string
  type: "number" | "string" | "select" | "tree"
  options?: { label: string; value: string }[]
}

export type RuleOperator = {
  id: string
  name: string
  symbol: string
  supportedFieldTypes: RuleField["type"][]
}

export type RuleValue =
  | string
  | number
  | { min: number; max: number }
  | string[]

export type Rule = {
  id: string
  fieldId: string
  operatorId: string
  value: RuleValue
}

export type RuleGroup = {
  id: string
  condition: "and" | "or"
  rules: (Rule | RuleGroup)[]
}

export type RuleBuilderProps = {
  fields: RuleField[]
  operators: RuleOperator[]
  value: RuleGroup
  onChange: (value: RuleGroup) => void
  className?: string
}

// Default fields and operators for demo purposes
export const defaultRuleFields: RuleField[] = [
  { id: "age", name: "年龄", type: "number" },
  { id: "city", name: "城市", type: "string" },
  { id: "region", name: "地区", type: "tree" },
  { id: "salary", name: "薪资", type: "number" },
  {
    id: "department",
    name: "部门",
    type: "select",
    options: [
      { label: "技术部", value: "tech" },
      { label: "市场部", value: "marketing" },
      { label: "财务部", value: "finance" },
    ],
  },
]

export const defaultRuleOperators: RuleOperator[] = [
  {
    id: "equals",
    name: "等于",
    symbol: "=",
    supportedFieldTypes: ["number", "string", "select"],
  },
  {
    id: "notEquals",
    name: "不等于",
    symbol: "≠",
    supportedFieldTypes: ["number", "string", "select"],
  },
  {
    id: "greaterThan",
    name: "大于",
    symbol: ">",
    supportedFieldTypes: ["number"],
  },
  {
    id: "lessThan",
    name: "小于",
    symbol: "<",
    supportedFieldTypes: ["number"],
  },
  {
    id: "greaterThanOrEqual",
    name: "大于等于",
    symbol: ">=",
    supportedFieldTypes: ["number"],
  },
  {
    id: "lessThanOrEqual",
    name: "小于等于",
    symbol: "<=",
    supportedFieldTypes: ["number"],
  },
  {
    id: "between",
    name: "区间",
    symbol: "between",
    supportedFieldTypes: ["number"],
  },
  {
    id: "contains",
    name: "包含",
    symbol: "contains",
    supportedFieldTypes: ["string"],
  },
  {
    id: "notContains",
    name: "不包含",
    symbol: "not contains",
    supportedFieldTypes: ["string"],
  },
]

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 9)

const getFieldById = (fields: RuleField[], id: string) =>
  fields.find((f) => f.id === id)
const getOperatorById = (operators: RuleOperator[], id: string) =>
  operators.find((o) => o.id === id)

// Components
function RuleGroupHeader({
  condition,
  onConditionChange,
  onAddRule,
  onAddGroup,
  isRoot = false,
}: {
  condition: "and" | "or"
  onConditionChange: (condition: "and" | "or") => void
  onAddRule: () => void
  onAddGroup: () => void
  isRoot?: boolean
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {!isRoot && (
        <div className="flex items-center gap-2">
          <GripVerticalIcon className="text-muted-foreground h-4 w-4 cursor-move" />
          <Label className="text-sm font-medium">规则组</Label>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">条件：</Label>
        <RadioGroup
          value={condition}
          onValueChange={(value) => onConditionChange(value as "and" | "or")}
          className="flex gap-4"
        >
          <div className="flex items-center gap-1">
            <RadioGroupItem value="and" id="and" />
            <Label htmlFor="and">与</Label>
          </div>
          <div className="flex items-center gap-1">
            <RadioGroupItem value="or" id="or" />
            <Label htmlFor="or">或</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="ml-auto flex gap-2">
        <Button variant="outline" size="sm" onClick={onAddRule}>
          <PlusIcon className="mr-1 h-4 w-4" />
          添加规则
        </Button>
        <Button variant="outline" size="sm" onClick={onAddGroup}>
          <PlusIcon className="mr-1 h-4 w-4" />
          添加组
        </Button>
      </div>
    </div>
  )
}

function RuleValueInput({
  field,
  operator,
  value,
  onChange,
}: {
  field?: RuleField
  operator?: RuleOperator
  value: RuleValue
  onChange: (value: RuleValue) => void
}) {
  if (!field || !operator) {
    return (
      <Input placeholder="请选择字段和运算符" disabled className="w-full" />
    )
  }

  // Handle number fields
  if (field.type === "number") {
    if (operator.id === "between") {
      const { min, max } = (value as { min: number; max: number }) || {
        min: 0,
        max: 0,
      }
      return (
        <div className="flex w-full gap-2">
          <Input
            type="number"
            placeholder="最小值"
            value={min}
            onChange={(e) => onChange({ min: Number(e.target.value), max })}
            className="flex-1"
          />
          <span className="flex items-center px-2">至</span>
          <Input
            type="number"
            placeholder="最大值"
            value={max}
            onChange={(e) => onChange({ min, max: Number(e.target.value) })}
            className="flex-1"
          />
        </div>
      )
    }
    return (
      <Input
        type="number"
        placeholder="输入数值"
        value={value as number}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    )
  }

  // Handle select fields
  if (field.type === "select" && field.options) {
    return (
      <Select value={value as string} onValueChange={(val) => onChange(val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择选项" />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  // Handle tree fields (simplified for demo)
  if (field.type === "tree") {
    return (
      <Select value={value as string} onValueChange={(val) => onChange(val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择地区" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beijing">北京市</SelectItem>
          <SelectItem value="shanghai">上海市</SelectItem>
          <SelectItem value="guangdong">广东省</SelectItem>
          <SelectItem value="jiangsu">江苏省</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  // Default text input for string fields
  return (
    <Input
      type="text"
      placeholder="输入文本"
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  )
}

function RuleItem({
  rule,
  index,
  fields,
  operators,
  onUpdate,
  onDelete,
}: {
  rule: Rule
  index: number
  fields: RuleField[]
  operators: RuleOperator[]
  onUpdate: (rule: Rule) => void
  onDelete: () => void
}) {
  const field = getFieldById(fields, rule.fieldId)
  const operator = getOperatorById(operators, rule.operatorId)
  const supportedOperators = field
    ? operators.filter((op) => op.supportedFieldTypes.includes(field.type))
    : []

  return (
    <div className="flex items-center gap-2 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="w-32 flex-shrink-0">
          <Select
            value={rule.fieldId}
            onValueChange={(value) => {
              const newField = getFieldById(fields, value)
              const defaultOperator = newField
                ? operators.find((op) =>
                    op.supportedFieldTypes.includes(newField.type)
                  )?.id
                : ""
              onUpdate({
                ...rule,
                fieldId: value,
                operatorId: defaultOperator || "",
                value: newField?.type === "number" ? 0 : "",
              })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择字段" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-32 flex-shrink-0">
          <Select
            value={rule.operatorId}
            onValueChange={(value) => {
              const newOperator = getOperatorById(operators, value)
              onUpdate({
                ...rule,
                operatorId: value,
                value:
                  newOperator?.id === "between"
                    ? { min: 0, max: 0 }
                    : field?.type === "number"
                      ? 0
                      : "",
              })
            }}
            disabled={!rule.fieldId}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择运算符" />
            </SelectTrigger>
            <SelectContent>
              {supportedOperators.map((op) => (
                <SelectItem key={op.id} value={op.id}>
                  {op.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-0 flex-1">
          <RuleValueInput
            field={field}
            operator={operator}
            value={rule.value}
            onChange={(value) => onUpdate({ ...rule, value })}
          />
        </div>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={onDelete}>
        <MinusIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

function RuleGroupComponent({
  group,
  fields,
  operators,
  onUpdate,
  onDelete,
  level = 0,
}: {
  group: RuleGroup
  fields: RuleField[]
  operators: RuleOperator[]
  onUpdate: (group: RuleGroup) => void
  onDelete: () => void
  level?: number
}) {
  const isRoot = level === 0

  const handleAddRule = () => {
    const newRule: Rule = {
      id: generateId(),
      fieldId: "",
      operatorId: "",
      value: "",
    }
    onUpdate({
      ...group,
      rules: [...group.rules, newRule],
    })
  }

  const handleAddGroup = () => {
    const newGroup: RuleGroup = {
      id: generateId(),
      condition: "and",
      rules: [],
    }
    onUpdate({
      ...group,
      rules: [...group.rules, newGroup],
    })
  }

  const handleUpdateRule = (index: number, rule: Rule) => {
    onUpdate({
      ...group,
      rules: group.rules.map((r, i) => (i === index ? rule : r)),
    })
  }

  const handleDeleteRule = (index: number) => {
    onUpdate({
      ...group,
      rules: group.rules.filter((_, i) => i !== index),
    })
  }

  const handleUpdateGroup = (index: number, updatedGroup: RuleGroup) => {
    onUpdate({
      ...group,
      rules: group.rules.map((r, i) => (i === index ? updatedGroup : r)),
    })
  }

  const handleDeleteGroup = (index: number) => {
    onUpdate({
      ...group,
      rules: group.rules.filter((_, i) => i !== index),
    })
  }

  return (
    <div className={cn("mb-3", !isRoot && "border-muted border-l-2 pl-6")}>
      <Card className={cn(!isRoot && "shadow-sm")}>
        <CardContent className="p-4">
          <RuleGroupHeader
            condition={group.condition}
            onConditionChange={(condition) => onUpdate({ ...group, condition })}
            onAddRule={handleAddRule}
            onAddGroup={handleAddGroup}
            isRoot={isRoot}
          />

          {group.rules.length === 0 ? (
            <div className="text-muted-foreground py-4 text-center">
              暂无规则，点击&quot;添加规则&quot;或&quot;添加组&quot;开始创建
            </div>
          ) : (
            <div className="space-y-3">
              {group.rules.map((item, index) => (
                <div key={item.id} className="relative">
                  {index > 0 && (
                    <div className="bg-muted absolute top-1/2 right-0 left-0 -z-10 h-px" />
                  )}
                  {index > 0 && (
                    <div className="mb-2 flex justify-center">
                      <span className="bg-background text-muted-foreground rounded-full px-2 text-xs">
                        {group.condition === "and" ? "并且" : "或者"}
                      </span>
                    </div>
                  )}

                  {"condition" in item ? (
                    <RuleGroupComponent
                      group={item}
                      fields={fields}
                      operators={operators}
                      onUpdate={(updatedGroup) =>
                        handleUpdateGroup(index, updatedGroup)
                      }
                      onDelete={() => handleDeleteGroup(index)}
                      level={level + 1}
                    />
                  ) : (
                    <RuleItem
                      rule={item}
                      index={index}
                      fields={fields}
                      operators={operators}
                      onUpdate={(updatedRule) =>
                        handleUpdateRule(index, updatedRule)
                      }
                      onDelete={() => handleDeleteRule(index)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {!isRoot && (
            <div className="mt-4 flex justify-end">
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <MinusIcon className="mr-1 h-4 w-4" />
                删除组
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function RuleBuilder({
  fields,
  operators,
  value,
  onChange,
  className,
}: RuleBuilderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <RuleGroupComponent
        group={value}
        fields={fields}
        operators={operators}
        onUpdate={onChange}
        onDelete={() => {}}
        level={0}
      />
    </div>
  )
}

RuleBuilder.displayName = "RuleBuilder"

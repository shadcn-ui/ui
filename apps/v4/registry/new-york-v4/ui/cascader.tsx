'use client'
import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/new-york-v4/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york-v4/ui/popover"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"

// 城市数据类型定义
export interface CascaderOption {
  value: string
  label: string
  children?: CascaderOption[]
  path?: string
}

// 组件属性定义
export interface CascaderProps {
  options: CascaderOption[]
  value?: string[] | string
  onChange?: (value: string[] | string) => void
  multiple?: boolean
  placeholder?: string
  maxHeight?: string
}

export function Cascader({ options, value, onChange, multiple = false, placeholder = "请选择", maxHeight = "300px" }: CascaderProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(multiple ? (Array.isArray(value) ? value : []) : [])
  const [singleValue, setSingleValue] = React.useState<string>(Array.isArray(value) ? (value[0] || "") : (value || ""))
  const [searchTerm, setSearchTerm] = React.useState("")
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(new Set())

  // 初始化选中值
  React.useEffect(() => {
    if (multiple) {
      setSelectedValues(Array.isArray(value) ? value : [])
    } else {
      setSingleValue(Array.isArray(value) ? (value[0] || "") : (value || ""))
    }
  }, [value, multiple])

  // 生成所有选项的扁平列表
  const flattenOptions = React.useMemo(() => {
    const result: CascaderOption[] = []
    const traverse = (options: CascaderOption[], parentPath: string[] = []) => {
      for (const option of options) {
        const path = [...parentPath, option.value]
        result.push({ ...option, path: path.join("/") })
        if (option.children) {
          traverse(option.children, path)
        }
      }
    }
    traverse(options)
    return result
  }, [options])

  // 生成所有选项的映射
  const optionsMap = React.useMemo(() => {
    return flattenOptionsToMap(options)
  }, [options])

  // 筛选选项
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options
    return filterOptions(options, searchTerm)
  }, [options, searchTerm])

  // 选中值对应的标签
  const selectedLabels = React.useMemo(() => {
    if (multiple) {
      return selectedValues.map(value => {
        const option = findOptionByValue(flattenOptions, value)
        return option ? option.label : ""
      }).filter(Boolean)
    } else {
      const option = findOptionByValue(flattenOptions, singleValue)
      return option ? [option.label] : []
    }
  }, [multiple, selectedValues, singleValue, flattenOptions])

  // 处理单选
  const handleSingleSelect = (option: CascaderOption) => {
    if (!option.children || option.children.length === 0) {
      setSingleValue(option.value)
      onChange?.(option.value)
      setOpen(false)
    }
  }

  // 处理多选
  const handleMultipleSelect = (option: CascaderOption, checked: boolean) => {
    let newSelectedValues: string[]
    const descendants = descendantsMap.get(option.value) || []
    
    if (checked) {
      // 选中时，添加自身及所有子选项
      newSelectedValues = [...selectedValues, ...descendants]
      // 去重
      newSelectedValues = [...new Set(newSelectedValues)]
    } else {
      // 取消选中时，移除自身及所有子选项
      newSelectedValues = selectedValues.filter(value => !descendants.includes(value))
    }
    setSelectedValues(newSelectedValues)
    onChange?.(newSelectedValues)
  }

  // 切换展开/收起
  const toggleExpand = (option: CascaderOption) => {
    const newExpandedKeys = new Set(expandedKeys)
    if (newExpandedKeys.has(option.value)) {
      newExpandedKeys.delete(option.value)
    } else {
      newExpandedKeys.add(option.value)
    }
    setExpandedKeys(newExpandedKeys)
  }

  // 缓存所有子选项的映射
  const descendantsMap = React.useMemo(() => {
    const map = new Map<string, string[]>()
    
    const getDescendants = (option: CascaderOption): string[] => {
      const descendants = [option.value]
      if (option.children) {
        for (const child of option.children) {
          descendants.push(...getDescendants(child))
        }
      }
      return descendants
    }
    
    for (const option of options) {
      const descendants = getDescendants(option)
      map.set(option.value, descendants)
      
      // 递归处理所有子选项
      if (option.children) {
        const processChild = (child: CascaderOption) => {
          const childDescendants = getDescendants(child)
          map.set(child.value, childDescendants)
          if (child.children) {
            child.children.forEach(processChild)
          }
        }
        option.children.forEach(processChild)
      }
    }
    
    return map
  }, [options])

  // 检查是否全部子选项都被选中
  const isAllChildrenSelected = (option: CascaderOption) => {
    const descendants = descendantsMap.get(option.value) || []
    return descendants.length > 0 && descendants.every(value => selectedValues.includes(value))
  }

  // 检查是否有子选项被选中
  const hasChildrenSelected = (option: CascaderOption) => {
    const descendants = descendantsMap.get(option.value) || []
    return descendants.length > 0 && descendants.some(value => selectedValues.includes(value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className={cn("truncate", !selectedLabels.length && "text-muted-foreground")}>
            {selectedLabels.length ? selectedLabels.join(", ") : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="搜索城市..." onValueChange={setSearchTerm} />
          <CommandList className={cn("max-h-[var(--max-height)] overflow-y-auto", { "pr-4": multiple })} style={{ "--max-height": maxHeight } as React.CSSProperties}>
            <CommandEmpty>未找到匹配的城市</CommandEmpty>
            <CascaderTree
              options={filteredOptions}
              multiple={multiple}
              selectedValues={multiple ? selectedValues : [singleValue]}
              onSelect={multiple ? handleMultipleSelect : handleSingleSelect}
              expandedKeys={expandedKeys}
              onToggleExpand={toggleExpand}
              isAllChildrenSelected={isAllChildrenSelected}
              hasChildrenSelected={hasChildrenSelected}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// 递归组件：级联树结构
interface CascaderTreeProps {
  options: CascaderOption[]
  multiple: boolean
  selectedValues: string[]
  onSelect: (option: CascaderOption, checked: boolean) => void
  expandedKeys: Set<string>
  onToggleExpand: (option: CascaderOption) => void
  isAllChildrenSelected: (option: CascaderOption) => boolean
  hasChildrenSelected: (option: CascaderOption) => boolean
  level?: number
}

function CascaderTree({ options, multiple, selectedValues, onSelect, expandedKeys, onToggleExpand, isAllChildrenSelected, hasChildrenSelected, level = 0 }: CascaderTreeProps) {
  if (!options.length) return null

  return (
    <CommandGroup>
      {options.map((option) => {
        const hasChildren = option.children && option.children.length > 0
        const isExpanded = expandedKeys.has(option.value)
        const isSelected = selectedValues.includes(option.value)
        const allChildrenSelected = isAllChildrenSelected(option)
        const someChildrenSelected = hasChildrenSelected(option)

        return (
          <React.Fragment key={option.value}>
            <CommandItem
              className={cn("flex items-center justify-between", level > 0 && `pl-${level * 4 + 2}`)}>
              <div className="flex items-center space-x-2">
                {multiple ? (
                  <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allChildrenSelected || isSelected}
                    indeterminate={someChildrenSelected && !allChildrenSelected}
                    onChange={(e) => onSelect(option, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                  />
                </div>
                ) : null}
                <span>{option.label}</span>
              </div>
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleExpand(option)
                  }}
                  className="ml-auto flex h-4 w-4 items-center justify-center"
                >
                  <ChevronsUpDown
                    className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-180" : "")}
                  />
                </button>
              ) : null}
              {!multiple && isSelected ? <Check className="ml-auto h-4 w-4" /> : null}
            </CommandItem>
            {hasChildren && isExpanded ? (
              <CascaderTree
                options={option.children || []}
                multiple={multiple}
                selectedValues={selectedValues}
                onSelect={onSelect}
                expandedKeys={expandedKeys}
                onToggleExpand={onToggleExpand}
                isAllChildrenSelected={isAllChildrenSelected}
                hasChildrenSelected={hasChildrenSelected}
                level={level + 1}
              />
            ) : null}
          </React.Fragment>
        )
      })}
    </CommandGroup>
  )
}

// 辅助函数：查找选项
function findOptionByValue(options: CascaderOption[], value: string): CascaderOption | undefined {
  for (const option of options) {
    if (option.value === value) return option
    if (option.children) {
      const found = findOptionByValue(option.children, value)
      if (found) return found
    }
  }
  return undefined
}

// 辅助函数：筛选选项
function filterOptions(options: CascaderOption[], searchTerm: string): CascaderOption[] {
  const filtered: CascaderOption[] = []
  const term = searchTerm.toLowerCase()

  for (const option of options) {
    if (option.label.toLowerCase().includes(term)) {
      filtered.push({ ...option, children: undefined })
      continue
    }

    if (option.children) {
      const filteredChildren = filterOptions(option.children, term)
      if (filteredChildren.length) {
        filtered.push({ ...option, children: filteredChildren })
      }
    }
  }

  return filtered
}

// 辅助函数：获取所有子选项
function getAllDescendants(option: CascaderOption): CascaderOption[] {
  const result: CascaderOption[] = [option]
  if (option.children) {
    for (const child of option.children) {
      result.push(...getAllDescendants(child))
    }
  }
  return result
}

// 辅助函数：将选项树扁平化为映射
function flattenOptionsToMap(options: CascaderOption[]): Map<string, CascaderOption> {
  const map = new Map<string, CascaderOption>()
  const traverse = (option: CascaderOption) => {
    map.set(option.value, option)
    if (option.children) {
      for (const child of option.children) {
        traverse(child)
      }
    }
  }
  options.forEach(option => traverse(option))
  return map
}
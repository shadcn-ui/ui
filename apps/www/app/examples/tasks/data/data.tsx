import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "active",
    label: "Active",
    icon: CheckCircledIcon,
  },
  {
    value: "expired",
    label: "Expired",
    icon: StopwatchIcon,
  },
  {
    value: "suspended",
    label: "Suspended",
    icon: CrossCircledIcon,
  },
]

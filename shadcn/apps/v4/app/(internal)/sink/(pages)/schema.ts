import { z } from "zod"

export const addons = [
  {
    id: "analytics",
    title: "Analytics",
    description: "Advanced analytics and reporting",
  },
  {
    id: "backup",
    title: "Backup",
    description: "Automated daily backups",
  },
  {
    id: "support",
    title: "Priority Support",
    description: "24/7 premium customer support",
  },
] as const

export const exampleFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .refine((value) => !/\d/.test(value), {
      message: "Name must not contain numbers",
    }),

  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address"),

  plan: z
    .string({
      required_error: "Please select a subscription plan",
    })
    .min(1, "Please select a subscription plan")
    .refine((value) => value === "basic" || value === "pro", {
      message: "Invalid plan selection. Please choose Basic or Pro",
    }),

  billingPeriod: z
    .string({
      required_error: "Please select a billing period",
    })
    .min(1, "Please select a billing period"),

  addons: z
    .array(z.string())
    .min(1, "Please select at least one add-on")
    .max(3, "You can select up to 3 add-ons"),

  teamSize: z.number().min(1).max(10),
  emailNotifications: z.boolean({
    required_error: "Please choose email notification preference",
  }),
  comments: z
    .string()
    .min(10, "Comments must be at least 10 characters")
    .max(240, "Comments must not exceed 240 characters"),
  startDate: z
    .date({
      required_error: "Please select a start date",
      invalid_type_error: "Invalid date format",
    })
    .min(new Date(), "Start date cannot be in the past")
    .refine(
      (date) => {
        const now = new Date()
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        return date <= oneWeekFromNow
      },
      {
        message: "Start date must be within the current week",
      }
    ),
  theme: z
    .string({
      required_error: "Please select a theme",
    })
    .min(1, "Please select a theme"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
})

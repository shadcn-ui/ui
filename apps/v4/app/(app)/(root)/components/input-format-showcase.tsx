"use client"

import { useState } from "react"
import { IconCheck, IconCreditCard, IconPhone } from "@tabler/icons-react"

import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"

/**
 * Showcase component displaying input formatting with enhanced accessibility
 */
export function InputFormatShowcase() {
  const [formattedPhone, setFormattedPhone] = useState("")
  const [formattedCard, setFormattedCard] = useState("")

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10)
    if (digits.length === 0) return ""
    if (digits.length <= 3) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const formatCard = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(.{4})/g, "$1 ").trim()
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950">
            <IconPhone className="h-4 w-4 text-blue-600" />
          </div>
          <Label htmlFor="phone-input" className="text-base font-semibold">
            Phone Number
          </Label>
        </div>
        <Input
          id="phone-input"
          type="tel"
          placeholder="Enter your phone number"
          value={formattedPhone}
          onChange={(e) => setFormattedPhone(e.target.value)}
          className="focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
        />
        <p className="text-sm text-muted-foreground">
          Format: (XXX) XXX-XXXX • Max 10 digits
        </p>
        {formattedPhone && (
          <div className="flex items-center gap-2 rounded-md bg-blue-50 p-2 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <IconCheck className="h-4 w-4" />
            Formatted: {formatPhone(formattedPhone)}
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-green-100 p-2 dark:bg-green-950">
            <IconCreditCard className="h-4 w-4 text-green-600" />
          </div>
          <Label htmlFor="card-input" className="text-base font-semibold">
            Card Number
          </Label>
        </div>
        <Input
          id="card-input"
          type="text"
          placeholder="Enter card number"
          value={formattedCard}
          onChange={(e) => setFormattedCard(e.target.value)}
          maxLength={19}
          className="focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
        />
        <p className="text-sm text-muted-foreground">
          Format: XXXX XXXX XXXX XXXX • Max 16 digits
        </p>
        {formattedCard && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 p-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            <IconCheck className="h-4 w-4" />
            Formatted: {formatCard(formattedCard)}
          </div>
        )}
      </div>

      <div className="space-y-2 rounded-md bg-blue-50 p-3 dark:bg-blue-950">
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
          ♿ Accessibility Features
        </p>
        <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
          <li>✓ Keyboard navigation with Tab</li>
          <li>✓ Dark blue focus rings (visible on Tab)</li>
          <li>✓ Real-time input formatting</li>
          <li>✓ Clear labels and instructions</li>
        </ul>
      </div>
    </div>
  )
}

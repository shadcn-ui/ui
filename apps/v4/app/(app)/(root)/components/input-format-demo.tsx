"use client"

import { useState } from "react"
import { IconPhone } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/new-york-v4/ui/input-group"

/**
 * Formats phone number as user types (e.g., "+1 (555) 123-4567")
 */
function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "").slice(0, 10)

  // Format as (XXX) XXX-XXXX
  if (digits.length === 0) return ""
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

/**
 * Formats credit card number with spaces (e.g., "4532 1234 5678 9010")
 */
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

export function InputFormatDemo() {
  const [phone, setPhone] = useState("")
  const [cardNumber, setCardNumber] = useState("")

  return (
    <div className="grid w-full max-w-sm gap-6">
      {/* Phone Number Formatter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <InputGroup>
          <InputGroupInput
            type="tel"
            placeholder="(123) 456-7890"
            value={formatPhoneNumber(phone)}
            onChange={(e) => setPhone(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
          />
          <InputGroupAddon>
            <IconPhone size={18} />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Credit Card Formatter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Card Number</label>
        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formatCardNumber(cardNumber)}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength={19}
            className="focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText className="text-xs">
              {cardNumber.replace(/\D/g, "").length}/16 digits
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}

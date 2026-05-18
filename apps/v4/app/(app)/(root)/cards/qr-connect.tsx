"use client"

import QRCode from "react-qr-code"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/base-rhea/ui/card"

export function QrConnect() {
  return (
    <Card>
      <CardContent className="flex justify-center pt-6">
        <div className="rounded-xl border bg-white p-4">
          <QRCode
            value="https://ledger.app/connect/jd-4829"
            size={160}
            level="M"
          />
        </div>
      </CardContent>
      <CardHeader className="text-center">
        <CardTitle>Scan to connect your mobile device</CardTitle>
        <CardDescription className="text-balance">
          Open the Ledger mobile app and scan this code to link your device.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

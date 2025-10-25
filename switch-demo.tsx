import React, { useState } from 'react'
import { Switch } from './apps/www/registry/default/ui/switch'

export default function SwitchDemo() {
  const [ltrChecked, setLtrChecked] = useState(false)
  const [rtlChecked, setRtlChecked] = useState(false)

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Switch RTL Support Demo</h1>
      
      {/* LTR Demo */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">LTR (Left-to-Right)</h2>
        <div className="flex items-center space-x-4">
          <Switch 
            dir="ltr" 
            checked={ltrChecked}
            onCheckedChange={setLtrChecked}
          />
          <span>Status: {ltrChecked ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      {/* RTL Demo */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">RTL (Right-to-Left)</h2>
        <div className="flex items-center space-x-4" dir="rtl">
          <Switch 
            dir="rtl" 
            checked={rtlChecked}
            onCheckedChange={setRtlChecked}
          />
          <span>Status: {rtlChecked ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      {/* Code Example */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Usage</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
{`// LTR (default)
<Switch dir="ltr" />

// RTL
<Switch dir="rtl" />`}
        </pre>
      </div>
    </div>
  )
}
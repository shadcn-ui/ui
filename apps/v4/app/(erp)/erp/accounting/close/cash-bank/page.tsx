"use client"

import { useEffect, useState } from 'react'

interface ValidationResult {
  success: boolean
  canClose: boolean
  period?: any
  checks?: Record<string, { pass: boolean; message: string }>
  ending_balances?: Array<{ account_id: number; account_name: string; balance: number }>
  clearing_balance?: number
  error?: string
}

export default function CashBankClosePage() {
  const [periodId, setPeriodId] = useState<string>('')
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [closing, setClosing] = useState(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    setMessage('')
  }, [periodId])

  const validate = async () => {
    if (!periodId) return
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`/api/accounting/close/cash-bank/validate?period_id=${periodId}`)
      const data = await res.json()
      setValidation(data)
    } catch (err: any) {
      setMessage(err?.message || 'Failed to validate')
    } finally {
      setLoading(false)
    }
  }

  const close = async () => {
    if (!periodId) return
    setClosing(true)
    setMessage('')
    try {
      const res = await fetch('/api/accounting/close/cash-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodId }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage('Cash/Bank closed for period')
        await validate()
      } else {
        setMessage(data.error || 'Failed to close')
      }
    } catch (err: any) {
      setMessage(err?.message || 'Failed to close')
    } finally {
      setClosing(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <input
          className="border px-2 py-1 rounded"
          placeholder="Period ID"
          value={periodId}
          onChange={(e) => setPeriodId(e.target.value)}
        />
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={validate}
          disabled={loading || !periodId}
        >
          {loading ? 'Validating...' : 'Validate'}
        </button>
        <button
          className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
          onClick={close}
          disabled={closing || !validation?.canClose}
        >
          {closing ? 'Closing...' : 'Close Cash/Bank'}
        </button>
        {validation?.period?.cash_closed && (
          <span className="px-2 py-1 bg-gray-200 rounded text-sm">CLOSED</span>
        )}
      </div>

      {message && <div className="text-sm text-red-600">{message}</div>}

      {validation && (
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold">Validation Checklist</h2>
            <ul className="list-disc ml-5 space-y-1">
              {validation.checks &&
                Object.entries(validation.checks).map(([key, val]) => (
                  <li key={key} className={val.pass ? 'text-green-700' : 'text-red-700'}>
                    {val.message}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Ending Balances</h2>
            <ul className="list-disc ml-5 space-y-1">
              {validation.ending_balances?.map((row) => (
                <li key={row.account_id}>
                  {row.account_name}: {row.balance.toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="text-sm">Clearing balance: {validation.clearing_balance?.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Textarea } from '@/registry/new-york-v4/ui/textarea'
import { CheckCircle2, XCircle, UserPlus, Clock, AlertCircle, FileText } from 'lucide-react'
import { WorkflowStatusBadge } from './WorkflowStatusBadge'

interface WorkflowApprovalCardProps {
  documentType: string
  documentId: number
  userId?: string
  onApprovalComplete?: () => void
}

export function WorkflowApprovalCard({
  documentType,
  documentId,
  userId,
  onApprovalComplete
}: WorkflowApprovalCardProps) {
  const [instance, setInstance] = useState<any>(null)
  const [approvals, setApprovals] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [comments, setComments] = useState('')
  const [selectedApprovalId, setSelectedApprovalId] = useState<number | null>(null)

  useEffect(() => {
    loadWorkflowStatus()
  }, [documentType, documentId])

  const loadWorkflowStatus = async () => {
    try {
      const response = await fetch(
        `/api/workflows/instances?document_type=${documentType}&document_id=${documentId}`
      )
      const data = await response.json()
      
      if (data.instances && data.instances.length > 0) {
        const inst = data.instances[0]
        setInstance(inst)
        
        // Load approvals for this instance
        const approvalsRes = await fetch(`/api/workflows/instances/${inst.id}`)
        const approvalsData = await approvalsRes.json()
        
        if (approvalsData.success) {
          setApprovals(approvalsData.instance.approvals || [])
          setHistory(approvalsData.instance.history || [])
        }
      }
    } catch (error) {
      console.error('Error loading workflow status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (approvalId: number) => {
    if (!userId) return
    
    setActionLoading(true)
    try {
      const response = await fetch(`/api/workflows/approvals/${approvalId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          comments: comments || 'Approved'
        })
      })

      if (response.ok) {
        setComments('')
        setSelectedApprovalId(null)
        await loadWorkflowStatus()
        onApprovalComplete?.()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      console.error('Error approving:', error)
      alert('Failed to process approval')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (approvalId: number) => {
    if (!userId || !comments) {
      alert('Please provide a reason for rejection')
      return
    }
    
    setActionLoading(true)
    try {
      const response = await fetch(`/api/workflows/approvals/${approvalId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          comments: comments
        })
      })

      if (response.ok) {
        setComments('')
        setSelectedApprovalId(null)
        await loadWorkflowStatus()
        onApprovalComplete?.()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      console.error('Error rejecting:', error)
      alert('Failed to reject workflow')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">Loading workflow status...</div>
        </CardContent>
      </Card>
    )
  }

  if (!instance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>No workflow configured for this document</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const pendingApprovals = approvals.filter(a => a.status === 'pending' && a.approver_id === userId)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workflow Status</CardTitle>
            <WorkflowStatusBadge status={instance.status} />
          </div>
          <CardDescription>
            {instance.workflow_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Step */}
          {instance.current_step_name && instance.status === 'in_progress' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Current Step</span>
              </div>
              <p className="text-sm text-blue-700">{instance.current_step_name}</p>
            </div>
          )}

          {/* Pending Approvals for Current User */}
          {pendingApprovals.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Your Pending Approvals</h4>
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{approval.step_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Assigned {new Date(approval.assigned_at).toLocaleDateString()}
                      </p>
                    </div>
                    {approval.due_at && (
                      <Badge variant="outline" className="text-orange-600">
                        Due: {new Date(approval.due_at).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>

                  {selectedApprovalId === approval.id ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add comments (required for rejection)"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(approval.id)}
                          disabled={actionLoading}
                          size="sm"
                          className="flex-1"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(approval.id)}
                          disabled={actionLoading || !comments}
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedApprovalId(null)
                            setComments('')
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedApprovalId(approval.id)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Review & Take Action
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Approval History */}
          {history.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Approval History</h4>
              <div className="space-y-2">
                {history.map((h, idx) => (
                  <div key={idx} className="text-sm border-l-2 border-gray-200 pl-3 py-1">
                    <div className="flex items-center gap-2">
                      {h.action === 'approved' && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                      {h.action === 'rejected' && <XCircle className="h-3 w-3 text-red-600" />}
                      <span className="font-medium capitalize">{h.action}</span>
                      <span className="text-muted-foreground">by {h.performer_name}</span>
                    </div>
                    {h.comments && (
                      <p className="text-muted-foreground mt-1">{h.comments}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(h.performed_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

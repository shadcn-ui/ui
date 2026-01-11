'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, UserPlus, Clock, AlertCircle } from 'lucide-react';

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Approval {
  approval_id: number;
  document_type: string;
  document_id: number;
  workflow_name: string;
  step_name: string;
  initiated_by_name: string;
  due_at: string | null;
  is_escalated: boolean;
}

export default function ApprovalsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const [delegateUserId, setDelegateUserId] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchApprovals();
    }
  }, [user]);

  const fetchApprovals = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/workflows/approvals?user_id=${user.id}&status=pending`);
      const data = await response.json();
      setApprovals(data.approvals || []);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approvalId: number) => {
    if (!user?.id) return;
    
    setActionLoading(approvalId);
    try {
      const response = await fetch(`/api/workflows/approvals/${approvalId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          comments: comments || 'Approved'
        })
      });

      if (response.ok) {
        alert('Approval processed successfully!');
        setComments('');
        setSelectedApproval(null);
        fetchApprovals();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to process approval');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (approvalId: number) => {
    if (!user?.id) return;
    
    if (!comments) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setActionLoading(approvalId);
    try {
      const response = await fetch(`/api/workflows/approvals/${approvalId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          comments: comments
        })
      });

      if (response.ok) {
        alert('Workflow rejected successfully!');
        setComments('');
        setSelectedApproval(null);
        fetchApprovals();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject workflow');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelegate = async (approvalId: number) => {
    if (!user?.id || !delegateUserId) {
      alert('Please select a user to delegate to');
      return;
    }
    
    setActionLoading(approvalId);
    try {
      const response = await fetch(`/api/workflows/approvals/${approvalId}/delegate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          delegate_to_user_id: delegateUserId,
          comments: comments || 'Delegated approval'
        })
      });

      if (response.ok) {
        alert('Approval delegated successfully!');
        setComments('');
        setDelegateUserId('');
        setSelectedApproval(null);
        fetchApprovals();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error delegating:', error);
      alert('Failed to delegate approval');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 0) return <span className="text-red-600 font-semibold">Overdue</span>;
    if (diffHours < 24) return <span className="text-orange-600 font-semibold">{diffHours}h remaining</span>;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Pending Approvals</h1>
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Pending Approvals</h1>
        <p className="text-gray-600 mt-1">{approvals.length} pending approval(s)</p>
      </div>

      {approvals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
          <p className="text-gray-600">You have no pending approvals at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div
              key={approval.approval_id}
              className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                approval.is_escalated ? 'border-red-500' : 'border-blue-500'
              }`}
            >
              {approval.is_escalated && (
                <div className="mb-3 flex items-center text-red-600 text-sm font-semibold">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  ESCALATED
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Workflow</div>
                  <div className="font-semibold text-lg">{approval.workflow_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Current Step</div>
                  <div className="font-semibold">{approval.step_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Document</div>
                  <div className="font-semibold">
                    {approval.document_type.replace(/_/g, ' ').toUpperCase()} #{approval.document_id}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Initiated By</div>
                  <div className="font-semibold">{approval.initiated_by_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Due Date</div>
                  <div className="font-semibold flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(approval.due_at)}
                  </div>
                </div>
              </div>

              {selectedApproval === approval.approval_id ? (
                <div className="border-t pt-4 mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Comments</label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                      placeholder="Add your comments here..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApprove(approval.approval_id)}
                      disabled={actionLoading === approval.approval_id}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {actionLoading === approval.approval_id ? 'Processing...' : 'Approve'}
                    </button>

                    <button
                      onClick={() => handleReject(approval.approval_id)}
                      disabled={actionLoading === approval.approval_id || !comments}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {actionLoading === approval.approval_id ? 'Processing...' : 'Reject'}
                    </button>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Delegate to user ID"
                        value={delegateUserId}
                        onChange={(e) => setDelegateUserId(e.target.value)}
                        className="border rounded px-3 py-2 w-48"
                      />
                      <button
                        onClick={() => handleDelegate(approval.approval_id)}
                        disabled={actionLoading === approval.approval_id || !delegateUserId}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Delegate
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedApproval(null);
                        setComments('');
                        setDelegateUserId('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedApproval(approval.approval_id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Take Action
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

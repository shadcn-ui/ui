'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, PlayCircle, PauseCircle } from 'lucide-react';

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface WorkflowDefinition {
  id: number;
  name: string;
  description: string;
  module: string;
  document_type: string;
  trigger_event: string;
  is_active: boolean;
  steps_count: number;
  active_instances_count: number;
  created_by_name: string;
}

interface WorkflowStep {
  step_name: string;
  step_order: number;
  step_type: string;
  approver_type: string;
  approver_user_id?: string;
  approver_role_id?: string;
  timeout_hours?: number;
  is_parallel: boolean;
  require_all_approvals: boolean;
}

export default function WorkflowSettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    module: 'purchase',
    document_type: 'purchase_order',
    trigger_event: 'on_create',
    is_active: true
  });
  
  const [steps, setSteps] = useState<WorkflowStep[]>([{
    step_name: 'Approval Step 1',
    step_order: 1,
    step_type: 'approval',
    approver_type: 'user',
    timeout_hours: 48,
    is_parallel: false,
    require_all_approvals: true
  }]);

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
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows/definitions');
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('You must be logged in');
      return;
    }

    try {
      const response = await fetch('/api/workflows/definitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          created_by: user.id,
          steps: steps
        })
      });

      if (response.ok) {
        alert('Workflow created successfully!');
        setShowCreateForm(false);
        resetForm();
        fetchWorkflows();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Failed to create workflow');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      module: 'purchase',
      document_type: 'purchase_order',
      trigger_event: 'on_create',
      is_active: true
    });
    setSteps([{
      step_name: 'Approval Step 1',
      step_order: 1,
      step_type: 'approval',
      approver_type: 'user',
      timeout_hours: 48,
      is_parallel: false,
      require_all_approvals: true
    }]);
  };

  const addStep = () => {
    setSteps([...steps, {
      step_name: `Approval Step ${steps.length + 1}`,
      step_order: steps.length + 1,
      step_type: 'approval',
      approver_type: 'user',
      timeout_hours: 48,
      is_parallel: false,
      require_all_approvals: true
    }]);
  };

  const removeStep = (index: number) => {
    if (steps.length === 1) {
      alert('Workflow must have at least one step');
      return;
    }
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: string, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Workflow Management</h1>
          <p className="text-gray-600 mt-1">{workflows.length} workflow(s) configured</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Workflow</h2>
          
          <form onSubmit={handleCreateWorkflow}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Workflow Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., Purchase Order Approval"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Module *</label>
                <select
                  value={formData.module}
                  onChange={(e) => setFormData({...formData, module: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="purchase">Purchase</option>
                  <option value="sales">Sales</option>
                  <option value="expenses">Expenses</option>
                  <option value="hr">HR</option>
                  <option value="inventory">Inventory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Document Type *</label>
                <input
                  type="text"
                  required
                  value={formData.document_type}
                  onChange={(e) => setFormData({...formData, document_type: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., purchase_order"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trigger Event *</label>
                <select
                  value={formData.trigger_event}
                  onChange={(e) => setFormData({...formData, trigger_event: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="on_create">On Create</option>
                  <option value="on_update">On Update</option>
                  <option value="on_status_change">On Status Change</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                  placeholder="Describe the workflow purpose..."
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Approval Steps</h3>
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </button>
              </div>

              {steps.map((step, index) => (
                <div key={index} className="border rounded p-4 mb-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">Step {index + 1}</h4>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Step Name *</label>
                      <input
                        type="text"
                        required
                        value={step.step_name}
                        onChange={(e) => updateStep(index, 'step_name', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Approver Type *</label>
                      <select
                        value={step.approver_type}
                        onChange={(e) => updateStep(index, 'approver_type', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                      >
                        <option value="user">Specific User</option>
                        <option value="role">Role</option>
                        <option value="dynamic">Dynamic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Timeout (hours)</label>
                      <input
                        type="number"
                        value={step.timeout_hours || ''}
                        onChange={(e) => updateStep(index, 'timeout_hours', parseInt(e.target.value))}
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="48"
                      />
                    </div>

                    {step.approver_type === 'user' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">User ID</label>
                        <input
                          type="text"
                          value={step.approver_user_id || ''}
                          onChange={(e) => updateStep(index, 'approver_user_id', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                          placeholder="User UUID"
                        />
                      </div>
                    )}

                    {step.approver_type === 'role' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Role ID</label>
                        <input
                          type="text"
                          value={step.approver_role_id || ''}
                          onChange={(e) => updateStep(index, 'approver_role_id', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                          placeholder="Role UUID"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Workflow
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold">{workflow.name}</h3>
                  {workflow.is_active ? (
                    <span className="flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      <PlayCircle className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      <PauseCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{workflow.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Module</div>
                    <div className="font-semibold">{workflow.module}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Document Type</div>
                    <div className="font-semibold">{workflow.document_type}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Steps</div>
                    <div className="font-semibold">{workflow.steps_count}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Active Instances</div>
                    <div className="font-semibold">{workflow.active_instances_count}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

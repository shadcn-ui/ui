/**
 * Workflow Automation Helper Functions
 * 
 * Use these functions to trigger workflows from your modules
 */

/**
 * Start a workflow for a document
 */
export async function startWorkflow(params: {
  workflowId: number;
  documentType: string;
  documentId: number;
  initiatedBy: string;
  metadata?: Record<string, any>;
}) {
  try {
    const response = await fetch('/api/workflows/instances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start workflow');
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting workflow:', error);
    throw error;
  }
}

/**
 * Execute business rules for an event
 */
export async function executeBusinessRules(params: {
  module: string;
  eventType: string;
  entityId: number;
  entityType: string;
  data: Record<string, any>;
}) {
  try {
    const response = await fetch('/api/rules/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to execute rules');
    }

    return await response.json();
  } catch (error) {
    console.error('Error executing rules:', error);
    throw error;
  }
}

/**
 * Send notification to user
 */
export async function sendNotification(params: {
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'approval';
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        metadata: params.metadata
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

/**
 * Queue an email
 */
export async function queueEmail(params: {
  toEmail: string;
  toName?: string;
  templateCode?: string;
  templateVariables?: Record<string, any>;
  subject?: string;
  bodyHtml?: string;
  bodyText?: string;
  priority?: 'high' | 'normal' | 'low';
  scheduledAt?: Date;
}) {
  try {
    const response = await fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to_email: params.toEmail,
        to_name: params.toName,
        template_code: params.templateCode,
        template_variables: params.templateVariables,
        subject: params.subject,
        body_html: params.bodyHtml,
        body_text: params.bodyText,
        priority: params.priority || 'normal',
        scheduled_at: params.scheduledAt?.toISOString()
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to queue email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error queueing email:', error);
    throw error;
  }
}

/**
 * Get workflow definition by module and document type
 */
export async function getWorkflowDefinition(module: string, documentType: string) {
  try {
    const response = await fetch(`/api/workflows/definitions?module=${module}&is_active=true`);
    const data = await response.json();
    
    // Find matching workflow
    const workflow = data.workflows?.find(
      (w: any) => w.document_type === documentType && w.is_active
    );
    
    return workflow || null;
  } catch (error) {
    console.error('Error fetching workflow definition:', error);
    return null;
  }
}

/**
 * Check if workflow should be triggered
 */
export async function shouldTriggerWorkflow(
  module: string,
  documentType: string,
  triggerEvent: string
): Promise<number | null> {
  try {
    const response = await fetch(`/api/workflows/definitions?module=${module}&is_active=true`);
    const data = await response.json();
    
    const workflow = data.workflows?.find(
      (w: any) => 
        w.document_type === documentType && 
        w.trigger_event === triggerEvent &&
        w.is_active
    );
    
    return workflow?.id || null;
  } catch (error) {
    console.error('Error checking workflow:', error);
    return null;
  }
}

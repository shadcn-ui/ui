// Database connection configuration and utilities
// Types for database operations

export interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  company: string
  job_title?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  source_id?: string
  source_name?: string
  status_id?: string
  status_name?: string
  assigned_to?: string
  assigned_name?: string
  estimated_value?: number
  notes?: string
  last_contacted?: string
  next_follow_up?: string
  created_at: string
  updated_at: string
}

export interface LeadSource {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface LeadStatus {
  id: string
  name: string
  description?: string
  sort_order: number
  color: string
  is_active: boolean
  created_at: string
}

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: string
  department?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseError extends Error {
  code?: string
  detail?: string
  hint?: string
}

// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ocean-erp',
  user: process.env.DB_USER || 'mac',
  password: process.env.DB_PASSWORD || '',
}

// For now, we'll create mock data functions that match our database structure
// This allows the app to work while we set up the full database integration

export const mockLeadSources: LeadSource[] = [
  { id: '1', name: 'Website', description: 'Leads from website contact forms', is_active: true, created_at: new Date().toISOString() },
  { id: '2', name: 'Referral', description: 'Leads from customer referrals', is_active: true, created_at: new Date().toISOString() },
  { id: '3', name: 'LinkedIn', description: 'Leads from LinkedIn outreach', is_active: true, created_at: new Date().toISOString() },
  { id: '4', name: 'Cold Call', description: 'Leads from cold calling', is_active: true, created_at: new Date().toISOString() },
  { id: '5', name: 'Trade Show', description: 'Leads from trade shows', is_active: true, created_at: new Date().toISOString() },
]

export const mockLeadStatuses: LeadStatus[] = [
  { id: '1', name: 'New', description: 'Newly created lead', sort_order: 1, color: '#3B82F6', is_active: true, created_at: new Date().toISOString() },
  { id: '2', name: 'Contacted', description: 'Initial contact made', sort_order: 2, color: '#8B5CF6', is_active: true, created_at: new Date().toISOString() },
  { id: '3', name: 'Qualified', description: 'Lead has been qualified', sort_order: 3, color: '#06B6D4', is_active: true, created_at: new Date().toISOString() },
  { id: '4', name: 'Opportunity', description: 'Lead converted to opportunity', sort_order: 4, color: '#10B981', is_active: true, created_at: new Date().toISOString() },
  { id: '5', name: 'Won', description: 'Lead successfully converted', sort_order: 5, color: '#22C55E', is_active: true, created_at: new Date().toISOString() },
  { id: '6', name: 'Lost', description: 'Lead was not converted', sort_order: 6, color: '#EF4444', is_active: true, created_at: new Date().toISOString() },
]

export const mockUsers: User[] = [
  { id: '1', email: 'sarah.johnson@ocean-erp.com', first_name: 'Sarah', last_name: 'Johnson', role: 'sales_manager', department: 'Sales', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', email: 'mike.wilson@ocean-erp.com', first_name: 'Mike', last_name: 'Wilson', role: 'sales_rep', department: 'Sales', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', email: 'alex.chen@ocean-erp.com', first_name: 'Alex', last_name: 'Chen', role: 'sales_rep', department: 'Sales', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', email: 'lisa.taylor@ocean-erp.com', first_name: 'Lisa', last_name: 'Taylor', role: 'sales_rep', department: 'Sales', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', email: 'david.brown@ocean-erp.com', first_name: 'David', last_name: 'Brown', role: 'sales_rep', department: 'Sales', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

// Mock database functions
export async function getLeadSources(): Promise<LeadSource[]> {
  return mockLeadSources
}

export async function getLeadStatuses(): Promise<LeadStatus[]> {
  return mockLeadStatuses
}

export async function getUsers(): Promise<User[]> {
  return mockUsers
}

export async function getLeads(): Promise<Lead[]> {
  // This would eventually query the database
  // For now, return mock data that matches our database structure
  return [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-1001',
      company: 'TechCorp Solutions',
      job_title: 'CTO',
      website: 'https://techcorp.com',
      source_name: 'Website',
      status_name: 'New',
      assigned_name: 'Sarah Johnson',
      estimated_value: 25000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Add more mock leads as needed
  ]
}

export async function createLead(leadData: Partial<Lead>): Promise<Lead> {
  // This would eventually insert into the database
  // For now, return a mock created lead
  const newLead: Lead = {
    id: Math.random().toString(36).substr(2, 9),
    first_name: leadData.first_name || '',
    last_name: leadData.last_name || '',
    email: leadData.email || '',
    phone: leadData.phone,
    company: leadData.company || '',
    job_title: leadData.job_title,
    website: leadData.website,
    address: leadData.address,
    city: leadData.city,
    state: leadData.state,
    zip_code: leadData.zip_code,
    country: leadData.country || 'US',
    estimated_value: leadData.estimated_value || 0,
    notes: leadData.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  return newLead
}
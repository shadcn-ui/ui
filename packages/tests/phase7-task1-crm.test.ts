import { describe, it, expect, beforeAll, afterAll } from 'vitest';

/**
 * Phase 7 Integration Tests - Task 1: CRM Foundation
 * 
 * Tests for:
 * - Leads API (CRUD operations)
 * - Contacts API (CRUD operations)
 * - Companies API (CRUD operations)
 * - Interactions API (timeline tracking)
 * - Lead conversion workflow
 * - Database triggers and views
 */

const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000/api';

// Test data
let testLeadId: number;
let testContactId: number;
let testCompanyId: number;
let testInteractionId: number;

describe('Phase 7 - Task 1: CRM Foundation', () => {
  
  // ========================================
  // Leads API Tests
  // ========================================
  
  describe('Leads API', () => {
    it('should create a new lead', async () => {
      const response = await fetch(`${API_BASE}/crm/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@testcompany.com',
          phone: '+1-555-0100',
          company_name: 'Test Company Inc',
          job_title: 'CEO',
          lead_source: 'website',
          lead_status: 'new',
          industry: 'Technology',
          estimated_value: 50000,
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('lead_id');
      expect(data.data.first_name).toBe('John');
      expect(data.data.email).toBe('john.doe@testcompany.com');
      
      testLeadId = data.data.lead_id;
    });

    it('should list all leads', async () => {
      const response = await fetch(`${API_BASE}/crm/leads`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.leads)).toBe(true);
      expect(data.data.leads.length).toBeGreaterThan(0);
    });

    it('should filter leads by status', async () => {
      const response = await fetch(`${API_BASE}/crm/leads?lead_status=new`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      data.data.leads.forEach((lead: any) => {
        expect(lead.lead_status).toBe('new');
      });
    });

    it('should get lead by ID with details', async () => {
      const response = await fetch(`${API_BASE}/crm/leads/${testLeadId}`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.lead_id).toBe(testLeadId);
      expect(data.data).toHaveProperty('interactions');
      expect(data.data).toHaveProperty('activities');
    });

    it('should update lead status', async () => {
      const response = await fetch(`${API_BASE}/crm/leads/${testLeadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_status: 'qualified',
          lead_score: 85
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.lead_status).toBe('qualified');
      expect(data.data.lead_score).toBe(85);
    });

    it('should search leads by name or email', async () => {
      const response = await fetch(`${API_BASE}/crm/leads?search=john`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.leads.length).toBeGreaterThan(0);
    });
  });

  // ========================================
  // Contacts API Tests
  // ========================================

  describe('Contacts API', () => {
    it('should create a new contact', async () => {
      const response = await fetch(`${API_BASE}/crm/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@company.com',
          phone: '+1-555-0101',
          job_title: 'CTO',
          department: 'Technology',
          contact_type: 'customer',
          is_primary: true,
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('contact_id');
      
      testContactId = data.data.contact_id;
    });

    it('should list all contacts', async () => {
      const response = await fetch(`${API_BASE}/crm/contacts`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.contacts)).toBe(true);
    });

    it('should get contact by ID', async () => {
      const response = await fetch(`${API_BASE}/crm/contacts/${testContactId}`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.contact_id).toBe(testContactId);
    });

    it('should update contact information', async () => {
      const response = await fetch(`${API_BASE}/crm/contacts/${testContactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '+1-555-0199',
          mobile: '+1-555-0200'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.phone).toBe('+1-555-0199');
    });

    it('should filter contacts by type', async () => {
      const response = await fetch(`${API_BASE}/crm/contacts?contact_type=customer`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      data.data.contacts.forEach((contact: any) => {
        expect(contact.contact_type).toBe('customer');
      });
    });
  });

  // ========================================
  // Companies API Tests
  // ========================================

  describe('Companies API', () => {
    it('should create a new company', async () => {
      const response = await fetch(`${API_BASE}/crm/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: 'Tech Innovations Ltd',
          company_type: 'customer',
          industry: 'Technology',
          company_size: '51-200',
          annual_revenue: 5000000,
          website: 'https://techinnovations.com',
          phone: '+1-555-0300',
          email: 'info@techinnovations.com',
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('company_id');
      
      testCompanyId = data.data.company_id;
    });

    it('should list all companies', async () => {
      const response = await fetch(`${API_BASE}/crm/companies`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.companies)).toBe(true);
    });

    it('should get company by ID with contacts', async () => {
      const response = await fetch(`${API_BASE}/crm/companies/${testCompanyId}`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.company_id).toBe(testCompanyId);
      expect(data.data).toHaveProperty('contacts');
    });

    it('should update company information', async () => {
      const response = await fetch(`${API_BASE}/crm/companies/${testCompanyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annual_revenue: 6000000,
          company_size: '201-500'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.annual_revenue).toBe(6000000);
    });

    it('should filter companies by industry', async () => {
      const response = await fetch(`${API_BASE}/crm/companies?industry=Technology`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      data.data.companies.forEach((company: any) => {
        expect(company.industry).toBe('Technology');
      });
    });
  });

  // ========================================
  // Interactions API Tests
  // ========================================

  describe('Interactions API', () => {
    it('should create a new interaction', async () => {
      const response = await fetch(`${API_BASE}/crm/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: testLeadId,
          interaction_type: 'call',
          interaction_date: new Date().toISOString(),
          subject: 'Initial Discovery Call',
          notes: 'Discussed requirements and timeline',
          outcome: 'positive',
          duration_minutes: 30,
          created_by: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('interaction_id');
      
      testInteractionId = data.data.interaction_id;
    });

    it('should list all interactions', async () => {
      const response = await fetch(`${API_BASE}/crm/interactions`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.interactions)).toBe(true);
    });

    it('should filter interactions by type', async () => {
      const response = await fetch(`${API_BASE}/crm/interactions?interaction_type=call`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      data.data.interactions.forEach((interaction: any) => {
        expect(interaction.interaction_type).toBe('call');
      });
    });

    it('should get interactions for a specific lead', async () => {
      const response = await fetch(`${API_BASE}/crm/interactions?lead_id=${testLeadId}`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      data.data.interactions.forEach((interaction: any) => {
        expect(interaction.lead_id).toBe(testLeadId);
      });
    });
  });

  // ========================================
  // Lead Conversion Tests
  // ========================================

  describe('Lead Conversion Workflow', () => {
    it('should convert lead to contact', async () => {
      const response = await fetch(`${API_BASE}/crm/leads/${testLeadId}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          create_contact: true,
          create_company: true,
          converted_by: 1
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('contact_id');
      expect(data.data).toHaveProperty('company_id');
    });
  });

  // ========================================
  // Statistics & Reporting Tests
  // ========================================

  describe('CRM Statistics', () => {
    it('should get lead statistics', async () => {
      const response = await fetch(`${API_BASE}/crm/leads`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('statistics');
      expect(data.data.statistics).toHaveProperty('total_leads');
      expect(data.data.statistics).toHaveProperty('by_status');
    });

    it('should get conversion rate statistics', async () => {
      const response = await fetch(`${API_BASE}/crm/analytics/conversion-rate`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('conversion_rate');
    });
  });

  // ========================================
  // Cleanup
  // ========================================

  describe('Cleanup', () => {
    it('should delete test interaction', async () => {
      const response = await fetch(`${API_BASE}/crm/interactions/${testInteractionId}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(200);
    });

    it('should delete test lead', async () => {
      const response = await fetch(`${API_BASE}/crm/leads/${testLeadId}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(200);
    });

    it('should delete test contact', async () => {
      const response = await fetch(`${API_BASE}/crm/contacts/${testContactId}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(200);
    });

    it('should delete test company', async () => {
      const response = await fetch(`${API_BASE}/crm/companies/${testCompanyId}`, {
        method: 'DELETE'
      });
      expect(response.status).toBe(200);
    });
  });
});

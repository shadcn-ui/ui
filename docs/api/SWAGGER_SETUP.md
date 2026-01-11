# Swagger UI Setup Guide

This guide explains how to set up and use Swagger UI for interactive API documentation in Ocean ERP.

## 📋 Overview

Swagger UI provides an interactive interface for exploring and testing Ocean ERP APIs directly from your browser. It reads the OpenAPI 3.0 specification and generates a user-friendly documentation interface with "Try it out" functionality.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd apps/v4
pnpm add swagger-ui-express
```

### 2. Create Swagger Configuration

Create `apps/v4/src/config/swagger.ts`:

```typescript
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

// Load OpenAPI specification
const openApiPath = join(__dirname, '../../../../docs/api/openapi.yaml');
const openApiSpec = yaml.load(readFileSync(openApiPath, 'utf8'));

// Swagger UI options
export const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Ocean ERP API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai'
    }
  }
};

export { swaggerUi, openApiSpec };
```

### 3. Update Main Application

Add to `apps/v4/src/index.ts`:

```typescript
import express from 'express';
import { swaggerUi, openApiSpec, swaggerUiOptions } from './config/swagger';

const app = express();

// ... other middleware ...

// Swagger UI setup
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, swaggerUiOptions)
);

// Alternative: Serve OpenAPI JSON
app.get('/api-docs.json', (req, res) => {
  res.json(openApiSpec);
});

// ... routes ...

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
  console.log('API Docs available at http://localhost:4000/api-docs');
});
```

### 4. Start the Server

```bash
pnpm dev --filter=v4
```

### 5. Access Swagger UI

Open your browser and navigate to:
```
http://localhost:4000/api-docs
```

## 🎯 Using Swagger UI

### Authentication

1. Click the **Authorize** button (top right with lock icon)
2. Enter your API key in the `api_key` field
3. Click **Authorize**
4. Click **Close**

All subsequent requests will include your API key automatically.

### Testing Endpoints

1. **Expand an endpoint** by clicking on it
2. Click **Try it out** button
3. **Fill in parameters**:
   - Path parameters (e.g., `{id}`)
   - Query parameters (e.g., `page`, `limit`)
   - Request body (for POST/PUT requests)
4. Click **Execute**
5. View the response below:
   - Response body (JSON)
   - Response headers
   - Response code
   - Curl command

### Example: List Leads

1. Expand `GET /api/crm/leads`
2. Click **Try it out**
3. Set parameters:
   - `page`: 1
   - `limit`: 20
   - `lead_status`: qualified (optional)
4. Click **Execute**
5. View results in the response section

### Example: Create Project

1. Expand `POST /api/projects`
2. Click **Try it out**
3. Edit the request body:
```json
{
  "project_code": "PROJ-2025-001",
  "project_name": "New Implementation",
  "planned_start_date": "2025-01-01",
  "planned_end_date": "2025-06-30",
  "budget_amount": 100000,
  "created_by": 1
}
```
4. Click **Execute**
5. Check the response for the created project

## 🔧 Advanced Configuration

### Custom Theme

Add custom CSS in `swaggerUiOptions`:

```typescript
export const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #0ea5e9; }
    .swagger-ui .opblock-tag { font-size: 18px; }
  `
};
```

### Base URL Configuration

The OpenAPI spec defines two servers:
- Development: `http://localhost:4000/api`
- Production: `https://api.ocean-erp.com/v4`

Switch between them using the **Servers** dropdown in Swagger UI.

### Response Examples

Swagger UI automatically shows:
- Request schemas with field descriptions
- Response schemas with examples
- All possible HTTP status codes
- Error response formats

### Models Section

Scroll down to view all component schemas:
- Lead
- Project
- Error
- SuccessResponse
- PaginationMeta

Click on any model to see its full structure.

## 🎨 UI Features

### Available Features:

✅ **Try It Out** - Execute API calls directly from the browser  
✅ **Authentication** - Persistent API key authorization  
✅ **Request Examples** - Pre-filled request bodies  
✅ **Response Validation** - Instant validation of responses  
✅ **cURL Commands** - Copy curl commands for terminal use  
✅ **Schema Viewer** - Browse all data models  
✅ **Search/Filter** - Filter endpoints by tag or keyword  
✅ **Request Duration** - See how long each request takes  
✅ **Syntax Highlighting** - Color-coded JSON responses  

### Keyboard Shortcuts:

- `Ctrl/Cmd + F`: Search endpoints
- `Tab`: Navigate between fields
- `Enter`: Execute request (when focused on Execute button)

## 📊 API Coverage

Current OpenAPI specification covers:

### CRM APIs ✅
- Leads (list, create, get, update, convert)
- Contacts
- Companies
- Interactions

### Project Management APIs ✅
- Projects (list, create, get details)
- Tasks
- Time Tracking
- Resources
- Budgets
- Expenses
- Documents
- Analytics (5 report types)

### Coming Soon 🚧
- Sales APIs
- Support APIs
- Marketing APIs
- HRM APIs
- Asset Management APIs
- E-commerce APIs

## 🔒 Security

### Development Mode

In development, Swagger UI is accessible without authentication for testing purposes.

### Production Mode

For production:

1. **Enable Authentication**:
```typescript
app.use('/api-docs', 
  authenticateMiddleware, // Require login
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, swaggerUiOptions)
);
```

2. **Restrict Access by IP**:
```typescript
const allowedIPs = ['192.168.1.0/24'];
app.use('/api-docs', ipRestrictionMiddleware(allowedIPs), ...);
```

3. **Use HTTPS**:
```typescript
// Update OpenAPI spec servers
servers:
  - url: https://api.ocean-erp.com/v4
    description: Production API (HTTPS only)
```

## 📝 Maintaining the Specification

### Adding New Endpoints

1. **Edit** `docs/api/openapi.yaml`
2. **Add path** under `paths:` section
3. **Define schemas** in `components/schemas` if needed
4. **Restart server** to reload specification
5. **Refresh** Swagger UI in browser

Example:

```yaml
paths:
  /api/sales/opportunities:
    get:
      summary: List sales opportunities
      tags:
        - Sales
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        '200':
          description: List of opportunities
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Opportunity'
```

### Updating Existing Endpoints

1. Find the endpoint in `openapi.yaml`
2. Update parameters, request body, or responses
3. Restart server
4. Test in Swagger UI

### Validating Specification

Use online validators:
- https://editor.swagger.io/
- https://apitools.dev/swagger-parser/online/

Or install local validator:
```bash
npm install -g @apidevtools/swagger-cli
swagger-cli validate docs/api/openapi.yaml
```

## 🚀 Alternative Tools

### Redoc

Alternative documentation UI with better design:

```bash
pnpm add redoc-express
```

```typescript
import { redoc } from 'redoc-express';

app.use('/api-docs-redoc', redoc({
  title: 'Ocean ERP API Docs',
  specUrl: '/api-docs.json',
  redocOptions: {
    theme: {
      colors: {
        primary: { main: '#0ea5e9' }
      }
    }
  }
}));
```

### Stoplight Elements

Modern, component-based documentation:

```bash
pnpm add @stoplight/elements
```

### Postman

Import OpenAPI spec directly into Postman:
1. Open Postman
2. Click **Import**
3. Select `docs/api/openapi.yaml`
4. Choose **OpenAPI 3.0**
5. Click **Import**

## 🐛 Troubleshooting

### Swagger UI Not Loading

**Issue**: Blank page at `/api-docs`

**Solutions**:
1. Check console for errors
2. Verify OpenAPI spec is valid YAML
3. Ensure `swagger-ui-express` is installed
4. Check file path to `openapi.yaml`

### CORS Errors

**Issue**: "CORS policy blocked"

**Solution**: Add CORS middleware:
```typescript
import cors from 'cors';
app.use(cors({ origin: 'http://localhost:4000' }));
```

### Authentication Not Working

**Issue**: 401 Unauthorized errors

**Solutions**:
1. Click **Authorize** button
2. Enter valid API key
3. Check security scheme in OpenAPI spec
4. Verify middleware is checking `X-API-Key` header

### Changes Not Appearing

**Issue**: Updated openapi.yaml but changes not visible

**Solutions**:
1. Restart the server
2. Hard refresh browser (Ctrl+F5)
3. Clear browser cache
4. Check if spec is cached

## 📚 Resources

- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI Documentation](https://swagger.io/docs/open-source-tools/swagger-ui/)
- [swagger-ui-express NPM](https://www.npmjs.com/package/swagger-ui-express)
- [Ocean ERP API Reference](./API_REFERENCE.md)
- [Ocean ERP OpenAPI Spec](./openapi.yaml)

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure Swagger UI
3. ✅ Access at `/api-docs`
4. ✅ Test CRM endpoints
5. ✅ Test Project endpoints
6. ⏳ Add remaining module endpoints
7. ⏳ Enable authentication in production
8. ⏳ Add custom branding

---

**Version:** 4.0.0  
**Last Updated:** December 2025  
**Maintained by:** Ocean ERP Team

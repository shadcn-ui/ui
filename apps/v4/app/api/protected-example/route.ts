import { NextRequest } from 'next/server'
import { requirePermission } from '@/lib/auth/middleware'
import { productionLockResponse } from '@/lib/runtime-flags'

// Example: Protect products API endpoint with permission check
export async function GET(request: NextRequest) {
  const locked = productionLockResponse('Protected example API')
  if (locked) return locked

  return requirePermission(request, 'products', 'view', async (req, user) => {
    // User is authenticated and has 'products:view' permission
    // Your existing products logic here
    
    return Response.json({
      message: 'Products endpoint - user has permission',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
      }
    });
  });
}

// Example: POST endpoint requiring 'products:create' permission
export async function POST(request: NextRequest) {
  const locked = productionLockResponse('Protected example API')
  if (locked) return locked

  return requirePermission(request, 'products', 'create', async (req, user) => {
    // User is authenticated and has 'products:create' permission
    const body = await req.json();
    
    // Your product creation logic here
    
    return Response.json({
      message: 'Product created successfully',
      created_by: user.email,
    });
  });
}

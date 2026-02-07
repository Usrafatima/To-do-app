import { NextRequest, NextResponse } from 'next/server';

// Map prefixes to service Dapr sidecar addresses
const SERVICE_MAP: Record<string, string> = {
  'tasks': 'task-service-dapr',
  'audit': 'audit-service-dapr',
  'auth': 'auth-service-dapr',
  'reminders': 'reminder-service-dapr',
  'recurring': 'recurring-service-dapr',
  'api': 'chat-service-dapr',
};

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path;
  if (!path || path.length === 0) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  // Determine if we should use microservices (Dapr) or monolith fallback
  const useMicroservices = process.env.USE_MICROSERVICES === 'true';
  const backendUrl = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000';

  let targetUrl = '';

  if (useMicroservices) {
    const servicePrefix = path[0];
    const sidecarHostname = SERVICE_MAP[servicePrefix] || 'task-service-dapr';
    const targetAppId = sidecarHostname.replace('-dapr', '');
    
    // Construct the Dapr invocation URL
    // We remove 'auth' prefix but keep 'tasks' (because the task-service uses @router.get("/tasks"))
    let methodPath = path.join('/');
    if (servicePrefix === 'auth') {
      methodPath = path.slice(1).join('/');
    }
    
    targetUrl = `http://${sidecarHostname}:3500/v1.0/invoke/${targetAppId}/method/${methodPath}`;
  } else {
    // Monolith fallback
    // Join path components to form the full path, e.g., "auth/google" or "tasks"
    const methodPath = path.join('/');
    targetUrl = `${backendUrl}/${methodPath}`;
  }

  console.log(`[Proxy] Forwarding to ${targetUrl}`);

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text();
    
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': req.headers.get('Content-Type') || 'application/json',
        ...(req.headers.get('Authorization') ? { 'Authorization': req.headers.get('Authorization')! } : {}),
      },
      body: body,
      cache: 'no-store'
    };

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json({ 
      error: 'Proxy Error', 
      message: error.message,
      target: targetUrl
    }, { status: 502 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
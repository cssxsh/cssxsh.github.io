

// @ts-ignore
const ALLOWED_ORIGINS = [
    /^(https?:\/\/)?localhost(:\d+)?/,
    /^(https:\/\/)?(\w+)\.github\.io$/
];

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': '*',
};

async function handleRequest(request: Request) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || '*';

    console.log(url);
    const dohUrl = url.pathname.substr(1).replace(/https:\/(?=[^/])/, 'https://') + url.search;

    // Rewrite request to point to API url. This also makes the request mutable
    // so we can add the correct Origin header to make the API server think
    // that this request isn't cross-site.
    request = new Request(dohUrl, request);
    request.headers.set('Origin', new URL(dohUrl).origin);
    let response = await fetch(request);
    // Recreate the response so we can modify the headers
    response = new Response(response.body, response);
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin);
    // Append to/Add Vary header so browser will cache response correctly
    response.headers.append('Vary', 'Origin');
    return response
}

function handleOptions(request: Request) {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    if (request.headers.get('Origin') !== null &&
        request.headers.get('Access-Control-Request-Method') !== null &&
        request.headers.get('Access-Control-Request-Headers') !== null) {
        // Handle CORS pre-flight request.
        // If you want to check the requested method + headers
        // you can do that here.
        return new Response(null, {
            headers: CORS_HEADERS,
        })
    }
    else {
        // Handle standard OPTIONS request.
        // If you want to allow other HTTP Methods, you can do that here.
        return new Response(null, {
            headers: {
                Allow: 'GET, POST, OPTIONS',
            },
        })
    }
}

export default () => {
    window.addEventListener('fetch', event => {
        // @ts-ignore
        const request = event.request;
        // @ts-ignore
        const respondWith = event.respondWith;
        const url = new URL(request.url);
        const origin = request.headers.get("Origin") || "";
        const allowed = ALLOWED_ORIGINS.some((ao) => origin.match(ao) != null);

        if (url.pathname === '/') {
            respondWith(htmlResponse());
        } else if (request.method === 'OPTIONS') {
            // Handle CORS preflight requests
            respondWith(handleOptions(request));
        } else if ((request.method === 'GET' || request.method === 'POST') && allowed) {
            // Handle POST or GET with valid origin
            respondWith(handleRequest(request));
        } else {
            respondWith(new Response(null, {
                    status: 405,
                    statusText: 'Not Allowed',
                })
            );
        }
    });
}

// BASIC HTML PAGE
async function htmlResponse() {
    const demoPage = `
<!DOCTYPE html>
<html>
<body>
  <p>This is a CORS proxy server for cssxsh.github.io. 
  <a href="https://developers.cloudflare.com/workers/templates/pages/cors_header_proxy/">See here for a similar example</a>
</body>
</html>`;

    return new Response(demoPage, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    })
}
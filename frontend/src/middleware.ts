import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
    '/login',
    '/register',
    '/api/auth/login',
    '/api/auth/refresh',
    '/_next',
    '/favicon.ico'
];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    const isPublicRoute = publicRoutes.some(publicPath => 
        path === publicPath || path.startsWith(publicPath)
    );

    if (isPublicRoute) {
        return NextResponse.next();
    }

    const authToken = request.cookies.get('access_token');
    
    if (!authToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
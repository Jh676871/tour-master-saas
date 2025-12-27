import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 路由保護邏輯
  const path = request.nextUrl.pathname
  
  // 排除靜態資源、圖片、API 路由等 (通常在 middleware config matcher 處理，但這裡雙重保險)
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/static') ||
    path.includes('.') 
  ) {
    return supabaseResponse
  }

  // 定義公開路徑
  const isPublicPath = path === '/login' || path === '/register'
  
  // 定義旅客頁面 (例外)
  const isTripPage = path.startsWith('/trip')

  // 1. 如果使用者未登入，且不是在公開頁面或旅客頁面，導向登入頁
  if (!user && !isPublicPath && !isTripPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    
    // 創建 Redirect Response
    const redirectResponse = NextResponse.redirect(url)
    
    // CRITICAL: Copy cookies from supabaseResponse (which might have refreshed tokens) to the redirect response
    const cookiesToSet = supabaseResponse.cookies.getAll()
    cookiesToSet.forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    
    return redirectResponse
  }

  // 2. 如果使用者已登入且在登入頁，導向首頁 (Dashboard)
  if (user && isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    
    const redirectResponse = NextResponse.redirect(url)
    
    // Copy cookies here too just in case
    const cookiesToSet = supabaseResponse.cookies.getAll()
    cookiesToSet.forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    
    return redirectResponse
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new Response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  return supabaseResponse
}

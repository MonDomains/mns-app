

export async function onRequest(context) {
    context.passThroughOnException()
    const { request, env } = context
    const response = await env.ASSETS.fetch(request)

    var html = await response.text()
    
    html = html.replaceAll("{{name}}", "");
    html = html.replaceAll("{{title}}", "404 - Not Found");
    html = html.replaceAll("{{description}}", "The page was not found")
    html = html.replaceAll("{{timestamp}}", new Date().getTime());
 
    return new Response(html, response)
}


export async function onRequest(context) {
    context.passThroughOnException()
    const { request, env } = context
    const response = await env.ASSETS.fetch(request)

    var html = await response.text()
    
    html = html.replaceAll("{{name}}", context.params.name + ".mon");
    html = html.replaceAll("{{timestamp}}", new Date().getTime());
 
    return new Response(html, response)
}
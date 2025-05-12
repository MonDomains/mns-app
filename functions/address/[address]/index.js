

export async function onRequest(context) {
    context.passThroughOnException()
    const { request, env } = context
    const response = await env.ASSETS.fetch(request)

    var html = await response.text()
    
    html = html.replaceAll("{{name}}", "");
    html = html.replaceAll("{{address}}", context.params.address);
    html = html.replaceAll("{{title}}", context.params.address + ": Web3 Names");
    html = html.replaceAll("{{description}}", "View "+ context.params.address + " namees on Monad Blockchain")
    html = html.replaceAll("{{timestamp}}", new Date().getTime());
    html = html.replaceAll("{{ogImage}}", "https://dapp.monadns.com/images/site-og-image-v2.png")
    html = html.replaceAll("{{canonical_url}}", "/address/"+ context.params.address);
    return new Response(html, response)
}
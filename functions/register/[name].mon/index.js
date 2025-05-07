

export async function onRequest(context) {
    context.passThroughOnException()
    const { request, env } = context
    const response = await env.ASSETS.fetch(request)

    var html = await response.text()
    
    html = html.replaceAll("{{name}}", context.params.name + ".mon");
    html = html.replaceAll("{{title}}", "Register "+ context.params.name + ".mon");
    html = html.replaceAll("{{description}}", "Claim "+ context.params.name + ".mon web3 name on Monad Blockchain")
    html = html.replaceAll("{{timestamp}}", new Date().getTime());
    html = html.replaceAll("{{ogImage}}", "https://dapp.monadns.com/images/site-og-image.png")
    html = html.replaceAll("{{canonical_url}}", "/register/"+ context.params.name +".mon");
    
    return new Response(html, response)
}
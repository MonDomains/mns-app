

export async function onRequest(context) {
    context.passThroughOnException()
    const { request, env } = context
    const response = await env.ASSETS.fetch(request)

    var html = await response.text()
    
    html = html.replaceAll("{{name}}", "");
    html = html.replaceAll("{{address}}", "");
    html = html.replaceAll("{{title}}", "Your Web3 Names");
    html = html.replaceAll("{{description}}", "View your web3 names on Monad Blockchain")
    html = html.replaceAll("{{timestamp}}", new Date().getTime());
    html = html.replaceAll("{{ogImage}}", "https://dapp.monadns.com/images/site-og-image-v2.png")
    html = html.replaceAll("{{canonical_url}}", "/account");
    return new Response(html, response)
}
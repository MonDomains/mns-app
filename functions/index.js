

export async function onRequest(context) {
    context.passThroughOnException()
    const { request, env } = context
    const response = await env.ASSETS.fetch(request)

    var html = await response.text()
    
    html = html.replaceAll("{{name}}", "");
    html = html.replaceAll("{{title}}", "MNS: Mon Name Service");
    html = html.replaceAll("{{description}}", "Create your web3 identiy with .mon domain on Monad Blockchain")
    html = html.replaceAll("{{timestamp}}", new Date().getTime());
    html = html.replaceAll("{{ogImage}}", "https://dapp.monadns.com/images/site-og-image-v2.png")
    html = html.replaceAll("{{canonical_url}}", "/");
     
    return new Response(html, response)
}
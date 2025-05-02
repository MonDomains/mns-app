

export async function onRequest(context) {
    context.passThroughOnException()
    const { request, env } = context
    const response = await env.ASSETS.fetch(request)

    var html = await response.text()
    
    html = html.replaceAll("{{name}}", context.params.name + ".mon");
    html = html.replaceAll("{{title}}", context.params.name + ".mon | Web3 Profile");
    html = html.replaceAll("{{description}}", "View "+ context.params.name + ".mon web3 profile on Monad Blockchain")
    html = html.replaceAll("{{timestamp}}", new Date().getTime());
    html = html.replaceAll("{{ogImage}}", "https://metadata.monadns.com/card/"+ context.params.name +".mon?v="+ new Date().getTime())
 
    return new Response(html, response)
}
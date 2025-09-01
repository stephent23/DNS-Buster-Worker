export default {
  async fetch(request) {
    const url = new URL(request.url)
    const domain = url.searchParams.get('domain')
    const type = url.searchParams.get('type') || 'A'

    if (!domain) {
      return new Response('Usage: ?domain=infosecuriosity.co.uk&type=A', { status: 400 })
    }

    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`
    const dohResponse = await fetch(dohUrl, {
      headers: { 'Accept': 'application/dns-json' }
    })

    if (!dohResponse.ok) {
      return new Response('DNS request failed', { status: dohResponse.status })
    }

    const data = await dohResponse.json()
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

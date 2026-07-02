export default {
    async fetch(req, env, ctx) {
        const url = new URL(req.url);

        if (url.pathname === '/api')
            return new Response('Hello world', { status: 200 })

        return new Response('Forbidden request', { status: 403 })
    }
}
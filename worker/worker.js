export default {
    async fetch(req, env, ctx) {
        return new Response('Hello world', { status: 200 })
    }
}
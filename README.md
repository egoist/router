# hrouter

A router that works in Node.js, browser and Deno.

## Install

For Node.js:

```bash
npm i hrouter
```

```ts
import { Router } from 'hrouter'
```

For Deno:

```ts
import { Router } from 'https://unpkg.com/hrouter/mod.ts'
```

## Usage

```ts
const router = new Router()

router.get('/user/:user', (params) => {
  console.log(params.user)
})

router.get('/', () => {
  // do something
})

const { params, handlers } = router.find('GET', '/user/egoist')

for (const handler of handlers) {
  handler(params)
}
// prints: 'egoist'
```

## Supported route pattern

- Static (`/foo`, `/foo/bar`)
- Parameter (`/:title`, `/books/:title`, `/books/:genre/:title`)
- Parameter w/ Suffix (`/movies/:title.mp4`, `/movies/:title.(mp4|mov)`)
- Optional Parameters (`/:title?`, `/books/:title?`, `/books/:genre/:title?`)
- Wildcards (`*`, `/books/*`, `/books/:genre/*`)

## TODO

- [ ] Ranking system for routes, so you can add routes in random order.

## Credits

This is a fork of [trouter](https://github.com/lukeed/trouter), all credit goes to [@lukeed](https://github.com/lukeed).

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)

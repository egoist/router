import { createParser, comparePathParserScore } from '@egoist/path-parser'
import type { PathParser } from '@egoist/path-parser'

export type HTTPMethod =
  | 'ACL'
  | 'BIND'
  | 'CHECKOUT'
  | 'CONNECT'
  | 'COPY'
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'LINK'
  | 'LOCK'
  | 'M-SEARCH'
  | 'MERGE'
  | 'MKACTIVITY'
  | 'MKCALENDAR'
  | 'MKCOL'
  | 'MOVE'
  | 'NOTIFY'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PROPFIND'
  | 'PROPPATCH'
  | 'PURGE'
  | 'PUT'
  | 'REBIND'
  | 'REPORT'
  | 'SEARCH'
  | 'SOURCE'
  | 'SUBSCRIBE'
  | 'TRACE'
  | 'UNBIND'
  | 'UNLINK'
  | 'UNLOCK'
  | 'UNSUBSCRIBE'

export interface Route<THandler> {
  parser: PathParser
  method: string
  handlers: THandler[]
}

export { createParser, comparePathParserScore }

const normalizeRoutePath = (path: string) => {
  return path.replace('/*', '/:wild(.*)')
}

export type Options = {
  /** Sort routes by specificity */
  sortRoutes?: boolean
}

export class Router<THandler = any> {
  routes: Route<THandler>[]

  constructor(private opts: Options = {}) {
    this.routes = []
  }

  all = this.add.bind(this, '')
  get = this.add.bind(this, 'GET')
  head = this.add.bind(this, 'HEAD')
  patch = this.add.bind(this, 'PATCH')
  options = this.add.bind(this, 'OPTIONS')
  connect = this.add.bind(this, 'CONNECT')
  delete = this.add.bind(this, 'DELETE')
  trace = this.add.bind(this, 'TRACE')
  post = this.add.bind(this, 'POST')
  put = this.add.bind(this, 'PUT')

  use(path: string, ...handlers: THandler[]) {
    const parser = createParser(normalizeRoutePath(path))
    this.routes.push({ parser, method: '', handlers })
    this.sortRoutes()
    return this
  }

  add(method: HTTPMethod | '', path: string, ...handlers: THandler[]) {
    const parser = createParser(normalizeRoutePath(path))
    this.routes.push({ parser, method, handlers })
    this.sortRoutes()
    return this
  }

  sortRoutes() {
    if (!this.opts.sortRoutes) return
    this.routes = this.routes.sort((a, b) =>
      comparePathParserScore(a.parser, b.parser),
    )
  }

  find(method: HTTPMethod, url: string) {
    const isHEAD = method === 'HEAD'
    const arr = this.routes
    let params: Record<string, string | string[]> = {},
      handlers: THandler[] = []
    for (let i = 0; i < arr.length; i++) {
      const tmp = arr[i]
      if (
        tmp.method.length === 0 ||
        tmp.method === method ||
        (isHEAD && tmp.method === 'GET')
      ) {
        const match = tmp.parser.parse(url)
        if (match) {
          params = match
          handlers = tmp.handlers
          break
        }
      }
    }

    return { params, handlers }
  }
}

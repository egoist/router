// A fork of https://github.com/lukeed/trouter

// MIT Licensed: https://github.com/lukeed/regexparam
export function regexparam(
  str: string | RegExp,
  loose?: boolean,
): { keys: false; pattern: RegExp } | { keys: string[]; pattern: RegExp } {
  if (str instanceof RegExp) return { keys: false, pattern: str }
  var c,
    o,
    tmp,
    ext,
    keys = [],
    pattern = '',
    arr = str.split('/')
  arr[0] || arr.shift()

  while ((tmp = arr.shift())) {
    c = tmp[0]
    if (c === '*') {
      keys.push('wild')
      pattern += '/(.*)'
    } else if (c === ':') {
      o = tmp.indexOf('?', 1)
      ext = tmp.indexOf('.', 1)
      keys.push(tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length))
      pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)'
      if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext)
    } else {
      pattern += '/' + tmp
    }
  }

  return {
    keys: keys,
    pattern: new RegExp('^' + pattern + (loose ? '(?=$|/)' : '/?$'), 'i'),
  }
}

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
  keys: string[] | false
  pattern: RegExp
  method: string
  handlers: THandler[]
}

export class Router<THandler = any> {
  routes: Route<THandler>[]

  constructor() {
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

  use(route: string, ...handlers: THandler[]) {
    const { keys, pattern } = regexparam(route, true)
    this.routes.push({ keys, pattern, method: '', handlers })
    return this
  }

  add(method: HTTPMethod | '', route: string, ...handlers: THandler[]) {
    const { keys, pattern } = regexparam(route)
    this.routes.push({ keys, pattern, method, handlers })
    return this
  }

  find(method: HTTPMethod, url: string) {
    const isHEAD = method === 'HEAD'
    const arr = this.routes
    let matches: RegExpExecArray | null = null,
      params: Record<string, string> = {},
      handlers: THandler[] = []
    for (let i = 0; i < arr.length; i++) {
      const tmp = arr[i]
      if (
        tmp.method.length === 0 ||
        tmp.method === method ||
        (isHEAD && tmp.method === 'GET')
      ) {
        if (tmp.keys === false) {
          matches = tmp.pattern.exec(url)
          if (matches === null) continue
          if (matches.groups !== void 0)
            for (const k in matches.groups) params[k] = matches.groups[k]
          tmp.handlers.length > 1
            ? (handlers = handlers.concat(tmp.handlers))
            : handlers.push(tmp.handlers[0])
        } else if (tmp.keys.length > 0) {
          matches = tmp.pattern.exec(url)
          if (matches === null) continue
          for (let j = 0; j < tmp.keys.length; )
            params[tmp.keys[j]] = matches[++j]
          tmp.handlers.length > 1
            ? (handlers = handlers.concat(tmp.handlers))
            : handlers.push(tmp.handlers[0])
        } else if (tmp.pattern.test(url)) {
          tmp.handlers.length > 1
            ? (handlers = handlers.concat(tmp.handlers))
            : handlers.push(tmp.handlers[0])
        }
      } // else not a match
    }

    return { params, handlers }
  }
}

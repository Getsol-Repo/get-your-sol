import type { DeepPartial } from '@libhub/utils'
import { isObject } from 'lodash-es'
import ms from 'ms'

interface CacheOptions<T> {
  prefix?: string
  storage?: Storage
  namespace?: string
  defaultExpire?: string
  migrate?: (persistedState: unknown, version: number) => T[keyof T & string]
  version?: Partial<Record<keyof T, number> | number>
}

type CacheRecord<T extends Record<string, any>> = {
  [K in keyof T]?: {
    expire?: number | null
    version?: number
    value?: T[K]
  }
}
type KeySubscriber<T, K extends keyof T = keyof T> = (value: T[K] | null, prevValue: T[K] | null) => void
type AllKeysSubscriber<T> = (key: keyof T, value: T[keyof T] | null, prevValue: T[keyof T] | null) => void

// TODO: 增加适配器
export class Cache<T extends Record<string, any>> {
  protected readonly storage
  protected readonly prefix: string
  protected readonly namespace: string
  private subscribers = {} as Record<keyof T, KeySubscriber<T>[]>
  private subscribeAllFns = [] as AllKeysSubscriber<T>[]
  public constructor(protected options?: CacheOptions<T>) {
    const { prefix = '', storage = localStorage, namespace = '' } = options || {}
    this.storage = storage
    this.prefix = prefix ? `${prefix}-` : ''
    this.namespace = namespace
  }

  protected getVersion(key: keyof T) {
    const { version = 0 } = this.options || {}
    return isObject(version) ? version[key] : version
  }

  protected getNamespaceData() {
    let data: CacheRecord<T> = {}
    try {
      const stringData = this.storage.getItem(this.namespace) || '{}'
      data = JSON.parse(stringData)
    } catch (e) {
      console.error(e)
    }
    return data
  }

  public get<K extends keyof T & string>(key: K): T[K] | null {
    return this.internalGet(key)
  }

  protected internalGet<K extends keyof T & string>(key: K, ignoreVersion = false): T[K] | null {
    let data = {} as CacheRecord<T[K]>[K]
    const currentKey = this.getKey(key) as K
    try {
      if (this.namespace) {
        const namespaceData = this.getNamespaceData()
        data = namespaceData[currentKey] || {}
      } else {
        const stringData = this.storage.getItem(currentKey)
        data = stringData ? JSON.parse(stringData) : null
      }
    } catch (e) {
      console.error(e)
    }
    if (data) {
      const { value = null, expire, version = 0 } = data
      if (!expire || expire >= Date.now()) {
        if (version === this.getVersion(key)) {
          return value
        }
        const { migrate } = this.options || {}
        if (migrate && !ignoreVersion) {
          const migratedData = migrate(value, version)
          this.set(key, migratedData)
          return migratedData
        }
      }
      this.remove(key)
    }
    return null
  }

  public set<K extends keyof T & string>(key: K, value: T[K], expire?: string) {
    const currentExpire = expire || this.options?.defaultExpire
    const data = {
      expire: currentExpire ? new Date().getTime() + ms(currentExpire) : null,
      value,
      version: this.getVersion(key),
    }
    const currentKey = this.getKey(key)
    const subscribers = this.subscribers[key] || []
    const subscribeAllFns = this.subscribeAllFns
    const prevValue = (subscribers.length || subscribeAllFns) ? this.internalGet(key, true) : null
    if (this.namespace) {
      const namespaceData = this.getNamespaceData()
      this.storage.setItem(this.namespace, JSON.stringify({ ...namespaceData, [currentKey]: data }))
    } else {
      this.storage.setItem(currentKey, JSON.stringify(data))
    }
    subscribers.forEach((subscription) => {
      subscription(value, prevValue)
    })
    subscribeAllFns.forEach((subscription) => {
      subscription(key, value, prevValue)
    })
  }

  public remove<K extends keyof T>(key: K) {
    if (this.namespace) {
      try {
        const stringData = this.storage.getItem(this.namespace) || '{}'
        const parsedData = JSON.parse(stringData)
        delete parsedData[this.getKey(key)]
        return this.storage.setItem(this.namespace, JSON.stringify(parsedData))
      } catch (e) {
        console.error(e)
      }
    }
    return this.storage.removeItem(this.getKey(key))
  }

  public clear() {
    if (this.namespace) {
      return this.storage.removeItem(this.namespace)
    }
    return this.storage.clear()
  }

  public getAll(): DeepPartial<T> {
    const data: DeepPartial<T> = {}
    this.each((value, key) => {
      data[key as keyof T] = value
    })
    return data
  }

  public getKey(key: keyof T) {
    return `${this.prefix}${String(key)}`
  }

  protected removeKeyPrefix(key: string) {
    return key.replace(new RegExp(`^${this.prefix}`), '')
  }

  public each(callback: (value: any, key: string) => boolean | void) {
    if (this.namespace) {
      const namespaceData = this.getNamespaceData()
      for (const key in namespaceData) {
        if (Object.hasOwn(namespaceData, key)) {
          const keyWithoutPrefix = this.removeKeyPrefix(key)
          const value = this.get(keyWithoutPrefix)
          const result = callback(value, keyWithoutPrefix)
          if (result === false) {
            break
          }
        }
      }
      return
    }
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key && key.startsWith(this.prefix)) {
        const keyWithoutPrefix = this.removeKeyPrefix(key)
        const value = this.get(keyWithoutPrefix)
        const result = callback(value, keyWithoutPrefix)
        if (result === false) {
          break
        }
      }
    }
  }

  public subscribe<K extends keyof T>(key: K, fn: KeySubscriber<T, K>): () => void
  public subscribe(fn: AllKeysSubscriber<T>): () => void
  public subscribe<K extends keyof T>(keyOrFn: K | AllKeysSubscriber<T>, fn?: KeySubscriber<T, K>) {
    if (typeof keyOrFn === 'function') {
      this.subscribeAllFns.push(keyOrFn)
      return () => {
        this.subscribeAllFns = this.subscribeAllFns.filter((sub) => sub !== keyOrFn)
      }
    }
    if (!fn) {
      return () => {}
    }
    const key = keyOrFn
    if (!this.subscribers[key]) {
      this.subscribers[key] = []
    }
    this.subscribers[key].push(fn as any)
    return () => {
      this.subscribers[key] = this.subscribers[key].filter((sub) => sub !== fn)
    }
  }
}

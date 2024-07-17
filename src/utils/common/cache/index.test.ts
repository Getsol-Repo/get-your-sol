import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Cache } from '.'

interface TestCache {
  key1: string
  _key1: string
  key2: string
  key3: number
  keyArr: { a: number, b: string }[]
  keyBool: boolean
  keySym: symbol
  keyFn: () => string
  keyObj: { a: number, b: string }
}

describe('cache', () => {
  let cache: Cache<TestCache>
  beforeEach(() => {
    localStorage.clear()
    cache = new Cache<TestCache>({ prefix: 'test' })
  })

  describe('basic Operations', () => {
    it('should set and get a string value', () => {
      cache.set('key1', 'value1')
      expect(cache.get('key1')).toBe('value1')
    })

    it('should return null for a non-existent key', () => {
      // @ts-expect-error
      expect(cache.get('nonExistentKey')).toBeNull()
    })

    it('should remove a key', () => {
      cache.set('key1', 'value1')
      cache.remove('key1')
      expect(cache.get('key1')).toBeNull()
    })

    it('should clear all keys', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.clear()
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBeNull()
    })

    it('should get all keys', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      expect(cache.getAll()).toEqual({ key1: 'value1', key2: 'value2' })
    })

    it('should get full key', () => {
      expect(cache.getKey('key1')).toBe('test-key1')
    })

    it('should get full key with namespace', () => {
      const namespacedCache = new Cache<TestCache>({ prefix: 'test', namespace: 'namespace' })
      expect(namespacedCache.getKey('key1')).toBe('test-key1')
    })
  })

  describe('expiration Handling', () => {
    it('should handle expiration', () => {
      cache.set('_key1', 'value1', '1ms')
      setTimeout(() => {
        expect(cache.get('_key1')).toBeNull()
      }, 10)
    })
  })

  describe('namespace Handling', () => {
    it('should handle namespaces', () => {
      const namespacedCache = new Cache<TestCache>({ prefix: 'test', namespace: 'namespace' })
      namespacedCache.set('key1', 'value1')
      expect(namespacedCache.get('key1')).toBe('value1')
      expect(cache.get('key1')).toBeNull()
    })

    it('should remove a key from namespace', () => {
      const namespacedCache = new Cache<TestCache>({ prefix: 'test', namespace: 'namespace' })
      namespacedCache.set('key1', 'value1')
      namespacedCache.remove('key1')
      expect(namespacedCache.get('key1')).toBeNull()
    })

    it('should get all keys from namespace', () => {
      const namespacedCache = new Cache<TestCache>({ prefix: 'test', namespace: 'namespace' })
      namespacedCache.set('key1', 'value1')
      namespacedCache.set('key2', 'value2')
      expect(namespacedCache.getAll()).toEqual({ key1: 'value1', key2: 'value2' })
    })
  })

  describe('subscription Handling', () => {
    it('should subscribe to changes', () => {
      const callback = vi.fn()
      cache.subscribe('key1', callback)
      cache.set('key1', 'value1')
      expect(callback).toHaveBeenCalledWith('value1', null)
    })

    it('should call subscriber callback multiple times for same key', () => {
      const callback = vi.fn()
      cache.subscribe('key1', callback)
      cache.set('key1', 'value1')
      cache.set('key1', 'value2')
      expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should call subscriber callback for different keys', () => {
      const callback = vi.fn()
      cache.subscribe('key1', callback)
      cache.subscribe('key2', callback)
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should unsubscribe from changes', () => {
      const callback = vi.fn()
      const unsubscribe = cache.subscribe('key1', callback)
      cache.set('key1', 'value1')
      unsubscribe()
      cache.set('key1', 'value2')
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('iteration Handling', () => {
    it('should iterate with each method', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      const result: { [key: string]: any } = {}
      cache.each((value, key) => {
        result[key] = value
      })
      expect(result).toEqual({ key1: 'value1', key2: 'value2' })
    })

    it('should iterate namespace data', () => {
      const namespacedCache = new Cache<TestCache>({ prefix: 'test', namespace: 'namespace' })
      namespacedCache.set('key1', 'value1')
      namespacedCache.set('key2', 'value2')
      const result: { [key: string]: any } = {}
      namespacedCache.each((value, key) => {
        result[key] = value
      })
      expect(result).toEqual({ key1: 'value1', key2: 'value2' })
    })

    it('should stop iteration if callback returns false', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      const result: { [key: string]: any } = {}
      cache.each((value, key) => {
        result[key] = value
        if (key === 'key1') {
          return false
        }
      })
      expect(result).toEqual({ key1: 'value1' })
    })
  })

  describe('subscribe All Keys Handling', () => {
    it('should subscribe to all key changes', () => {
      const callback = vi.fn()
      cache.subscribe(callback)
      cache.set('key1', 'value1')
      expect(callback).toHaveBeenCalledWith('key1', 'value1', null)
    })

    it('should call subscriber callback multiple times for all keys', () => {
      const callback = vi.fn()
      cache.subscribe(callback)
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should call subscriber callback for different keys', () => {
      const callback = vi.fn()
      cache.subscribe(callback)
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key1', 'value2')

      expect(callback).toHaveBeenCalledWith('key1', 'value1', null)
      expect(callback).toHaveBeenCalledWith('key2', 'value2', null)
      expect(callback).toHaveBeenCalledWith('key1', 'value2', 'value1')
    })

    it('should unsubscribe from all key changes', () => {
      const callback = vi.fn()
      const unsubscribe = cache.subscribe(callback)
      cache.set('key1', 'value1')
      unsubscribe()
      cache.set('key2', 'value2')
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should call subscriber callback with correct types', () => {
      const callback = vi.fn()
      cache.subscribe(callback)
      cache.set('key1', 'value1')
      cache.set('key3', 123)
      expect(callback).toHaveBeenCalledWith('key1', 'value1', null)
      expect(callback).toHaveBeenCalledWith('key3', 123, null)
    })
  })

  describe('handling Various Data Types', () => {
    it('should set and get an array', () => {
      const arr = [{ a: 1, b: 'test1' }, { a: 2, b: 'test2' }]
      cache.set('keyArr', arr)
      expect(cache.get('keyArr')).toEqual(arr)
    })

    it('should set and get a number value', () => {
      cache.set('key3', 123)
      expect(cache.get('key3')).toBe(123)
    })

    it('should set and get a boolean value', () => {
      cache.set('keyBool', true)
      expect(cache.get('keyBool')).toBe(true)
    })

    it('should not support setting and getting a symbol value', () => {
      const sym = Symbol('test')
      cache.set('keySym', sym)
      expect(cache.get('keySym')).toBe(null)
    })

    it('should not support setting and getting a function', () => {
      const func = () => 'test'
      cache.set('keyFn', func)
      expect(cache.get('keyFn')).toBe(null)
    })

    it('should set and get an object', () => {
      const obj = { a: 1, b: 'test' }
      cache.set('keyObj', obj)
      expect(cache.get('keyObj')).toEqual(obj)
    })
  })
  describe('version and Migration Handling', () => {
    it('should update stored value after migration', () => {
      let cache = new Cache<TestCache>({
        prefix: 'test',
        version: 0,
      })
      cache.set('key1', 'value1')
      cache = new Cache<TestCache>({
        prefix: 'test',
        version: 1,
        migrate: vi.fn((value, version) => `${value}-migrated-v${version}`,
        ),
      })
      expect(cache.get('key1')).toBe('value1-migrated-v0')
    })
  })
})

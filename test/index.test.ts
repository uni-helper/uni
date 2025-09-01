import { describe, expect, it } from 'vitest'
import { resolvePlatformAlias } from '../src/utils/platform'

describe('resolvePlatformAlias', () => {
  it('应该保留未定义的平台和别名', () => {
    const aliasConfig = {
      'mp-weixin': ['wechat'],
    }
    
    expect(resolvePlatformAlias('custom-platform', aliasConfig)).toBe('custom-platform')
    expect(resolvePlatformAlias('unknown', aliasConfig)).toBe('unknown')
    expect(resolvePlatformAlias('random-text', aliasConfig)).toBe('random-text')
  })

  it('应该处理空别名配置', () => {
    const aliasConfig = {}
    
    expect(resolvePlatformAlias('h5', aliasConfig)).toBe('h5')
    expect(resolvePlatformAlias('custom', aliasConfig)).toBe('custom')
    expect(resolvePlatformAlias('anything', aliasConfig)).toBe('anything')
  })

  it('应该处理多个别名映射到同一平台', () => {
    const aliasConfig = {
      'h5': ['web', 'html', 'website'],
      'mp-weixin': ['wechat', 'weixin', 'wx'],
    }
    
    expect(resolvePlatformAlias('web', aliasConfig)).toBe('h5')
    expect(resolvePlatformAlias('html', aliasConfig)).toBe('h5')
    expect(resolvePlatformAlias('website', aliasConfig)).toBe('h5')
    expect(resolvePlatformAlias('wechat', aliasConfig)).toBe('mp-weixin')
    expect(resolvePlatformAlias('weixin', aliasConfig)).toBe('mp-weixin')
    expect(resolvePlatformAlias('wx', aliasConfig)).toBe('mp-weixin')
  })
})

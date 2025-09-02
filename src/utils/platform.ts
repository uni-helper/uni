import type { Platform } from '../constant'

/**
 * 解析平台别名
 * @param input - 输入的平台名称或别名
 * @param aliasConfig - 别名配置
 * @returns 如果找到别名映射则返回对应平台，否则返回原值
 */
export function resolvePlatformAlias(
  input: string,
  aliasConfig: Partial<Record<Platform, string[]>> = {},
): string {
  // 如果没有别名配置，直接返回原值
  if (!aliasConfig || Object.keys(aliasConfig).length === 0) {
    return input
  }

  // 检查是否是某个平台的别名
  for (const [platform, aliases] of Object.entries(aliasConfig)) {
    if (aliases?.includes(input)) {
      return platform
    }
  }

  // 如果不是别名，保留原值
  return input
}

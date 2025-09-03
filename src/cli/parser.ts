import type { CommandType, ParsedCommand } from './types'
import process from 'node:process'

/**
 * 验证命令是否有效
 */
function isValidCommand(cmd: string): cmd is CommandType {
  return ['dev', 'build', 'prepare'].includes(cmd)
}

/**
 * 解析命令行参数
 */
export function parseCommandLineArgs(): ParsedCommand {
  const [, , cmd, argument] = process.argv

  if (!cmd) {
    throw new Error('Missing command. Usage: unh <dev|build|prepare> [platform]')
  }

  if (!isValidCommand(cmd)) {
    throw new Error(`Invalid command: ${cmd}. Expected 'dev', 'build', or 'prepare'`)
  }

  return { command: cmd, argument }
}

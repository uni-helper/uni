#!/usr/bin/env node

import type { UniHelperConfig } from '../config/types'
import type { CommandType } from './types'
import process from 'node:process'
import { handleBuildCommand, handleDevCommand, handlePrepareCommand } from './commands'
import { loadCliConfig } from './config'
import { parseCommandLineArgs } from './parser'

/**
 * CLI入口函数
 * 负责初始化并执行相应的命令处理
 */
async function main(): Promise<void> {
  try {
    const config = await loadCliConfig()
    const { command, argument } = parseCommandLineArgs()

    await executeCommand(command, argument, config)
  }
  catch (error) {
    console.error('Fatal error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

/**
 * 根据命令类型执行相应的处理
 */
async function executeCommand(
  command: CommandType,
  argument: string | undefined,
  config: UniHelperConfig,
): Promise<void> {
  switch (command) {
    case 'prepare':
      await handlePrepareCommand(config)
      break

    case 'dev':
      await handleDevCommand(argument, config)
      break

    case 'build':
      await handleBuildCommand(argument, config)
      break

    default:
      // 这种情况理论上不会发生，因为parser已经验证过了
      throw new Error(`Unsupported command: ${command}`)
  }
}

// 启动CLI应用程序
main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})

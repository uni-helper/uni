/**
 * 支持的命令类型
 */
export type CommandType = 'dev' | 'build' | 'prepare'

/**
 * 自动生成的文件类型
 */
export type GenerateFileType = 'pages' | 'manifest'

/**
 * 构建或开发阶段
 */
export type BuildPhase = 'install' | 'dev' | 'build'

/**
 * 解析后的命令行参数
 */
export interface ParsedCommand {
  command: CommandType
  argument?: string
}

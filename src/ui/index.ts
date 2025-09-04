import type { ChildProcess } from 'node:child_process'
import process from 'node:process'
import blessed from 'blessed'
import spawn from 'cross-spawn'
import { PLATFORM } from '../constant'

export class UniHelperTerminalUi {
  private screen: blessed.Widgets.Screen
  private platformBox!: blessed.Widgets.ListElement
  private terminalBox!: blessed.Widgets.Log
  private infoBox!: blessed.Widgets.BoxElement
  private currentProcess: ChildProcess | null = null

  private padding = {
    left: 2,
    right: 2,
    top: 0,
    bottom: 1,
  }

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true,
    })

    this.setupUI()
    this.setupKeyHandlers()
  }

  private setupUI(): void {
    // 创建左侧平台选择列表
    this.platformBox = blessed.list({
      parent: this.screen,
      width: '20%',
      height: '70%',
      left: 0,
      top: 0,
      label: ' 平台启动 ',
      border: 'line',
      padding: this.padding,
      style: {
        selected: {
          bg: 'green',
          fg: 'white',
        },
        scrollbar: {
          bg: 'green',
          fg: 'white',
        },
      },
      keys: true,
      vi: true,
      mouse: true,
      items: PLATFORM as unknown as string[],
      scrollable: true,
      alwaysScroll: true,
    })

    // 创建右侧终端输出区域 - 使用log组件支持ANSI颜色
    this.terminalBox = blessed.log({
      parent: this.screen,
      label: 'Terminal Output',
      border: 'line',
      padding: this.padding,
      top: 0,
      left: '20%',
      width: '80%',
      height: '70%',
      scrollable: true,
      alwaysScroll: true,
      tags: true, // 支持blessed颜色标签
      wrap: true,
      keys: true,
      vi: true,
      scrollback: 1000, // 增加滚动缓冲区大小
    })

    // 创建底部系统信息区域
    this.infoBox = blessed.box({
      parent: this.screen,
      label: 'System Information',
      border: 'line',
      padding: this.padding,
      top: '70%',
      left: 0,
      width: '100%',
      height: '30%',
      content: '{green-fg}UniApp Terminal Launcher Ready{/green-fg}\n\n{cyan-fg}Features:{/cyan-fg}\n• Full ANSI color support enabled\n• Real-time terminal output\n• Process management\n\n{yellow-fg}Controls:{/yellow-fg}\n• Arrow keys: Navigate platform list\n• Enter: Start selected platform\n• Number keys 1-8: Quick selection\n• q or Esc: Exit application',
    })
  }

  private setupKeyHandlers(): void {
    this.screen.key(['escape', 'q', 'C-c'], () => {
      this.cleanup()
      process.exit(0)
    })

    this.platformBox.on('select', (item) => {
      const platform = item.content
      this.startPlatform(platform)
    })
  }

  cleanup(): void {
    this.screen.destroy()
    if (this.currentProcess) {
      this.currentProcess.kill('SIGTERM')
    }
  }

  startPlatform(platform: string): void {
    // Stop any running process
    if (this.currentProcess) {
      this.currentProcess.kill('SIGTERM')
    }

    this.screen.render()

    // Start new process
    this.currentProcess = spawn('uni', ['dev', '-p', platform], {
      stdio: 'pipe',
      shell: true,
    })

    // 清空日志并显示启动信息
    this.terminalBox.setContent('')

    this.currentProcess.stdout?.on('data', (data) => {
      // 直接输出原始数据，保留ANSI颜色代码
      const text = data.toString()
      const lines = text.split('\n')
      lines.forEach((line: string) => {
        if (line.trim()) {
          // blessed.log会自动处理ANSI转义序列
          this.terminalBox.log(`${line}`)
        }
      })
      this.screen.render()
    })

    this.currentProcess.stderr?.on('data', (data) => {
      // 错误输出 - 保留原始ANSI颜色，同时添加红色标记
      const text = data.toString()
      const lines = text.split('\n')
      lines.forEach((line: string) => {
        if (line.trim()) {
          // 如果错误输出没有颜色，添加红色前缀
          if (!line.includes('\x1B[')) {
            this.terminalBox.log(`{red-fg}[ERROR] ${line}{/red-fg}`)
          }
          else {
            this.terminalBox.log(line)
          }
        }
      })
      this.screen.render()
    })

    this.currentProcess.on('close', (code) => {
      const statusColor = code === 0 ? 'green' : 'red'
      this.terminalBox.log(`{${statusColor}-fg}Process exited with code: ${code}{/${statusColor}-fg}`)
      this.terminalBox.log(`{green-fg}${'='.repeat(50)}{/green-fg}`)
      this.screen.render()
      this.currentProcess = null
    })

    this.currentProcess.on('error', (error) => {
      this.terminalBox.log(`{red-fg}Failed to start: ${error.message}{/red-fg}`)
      this.screen.render()
      this.currentProcess = null
    })
  }

  selectPlatform(platform: string) {
    const index = PLATFORM.findIndex(item => item === platform)
    if (index !== -1) {
      this.platformBox.select(index)
    }
  }

  render() {
    this.screen.render()
  }
}

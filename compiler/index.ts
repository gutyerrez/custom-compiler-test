import { TypescriptCompiler } from '@poppinss/chokidar-ts'

import { Application } from '../src/index'

const application = new Application()

const compiler = new TypescriptCompiler(
  process.cwd(),
  'tsconfig.json',
  require('typescript')
)

const { error, config } = compiler.configParser().parse()

if (error) {
  console.error(error)
}

if (config && config.errors.length) {
  console.error(config.errors)
}

const watcher = compiler.watcher(config!, 'lsp')

watcher.on('watcher:ready', async () => {
  application.start()
})

for (const event of ['add', 'change', 'unlink']) {
  watcher.on(event as 'add' | 'change' | 'unlink', () => {
    application.restart()
  })
}

watcher.watch(['.'], {
  usePolling: true
})
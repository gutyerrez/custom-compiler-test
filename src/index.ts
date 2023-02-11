import execa, { ExecaChildProcess } from 'execa'

export class Application {
  private childProcess?: ExecaChildProcess

  public get isListening() {
    return this.childProcess && this.childProcess.connected && !this.childProcess.killed
  }

  public start = () => {
    if (this.isListening) {
      throw 'Http server is already connected. Call restart instead'
    }

    console.info(this.childProcess ? 're-starting http server...' : 'starting http server...')

    this.childProcess = execa.node('src/server/HttpServer.ts', [], {
      buffer: false,
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        FORCE_COLOR: 'true',
      }
    })

    this.childProcess.on('close', (code, signal) => console.log('close', { code, signal }))
    this.childProcess.on('exit', (code, signal) => console.log('exit', { code, signal }))
  }

  public stop() {
    if (this.childProcess) {
      this.childProcess.removeAllListeners()
      this.childProcess.kill('SIGKILL')
    }
  }

  public restart() {
    this.stop()
    this.start()
  }
}
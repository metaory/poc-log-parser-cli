import { readFile, writeFile } from 'fs/promises'

interface Options {
  inputPath: string
  outputPath: string
}

interface LogBody {
  transactionId: string
  details: string
}

export interface LogItem extends LogBody {
  timestamp: number
  loglevel: string
}

export class Parser {
  public inputPath: string
  public outputPath: string

  constructor(options: Options) {
    this.inputPath = options.inputPath
    this.outputPath = options.outputPath
  }

  private parseEpoch(date: string): number {
    return new Date(date).getTime()
  }

  private parseLogBody(arr: string[] = []): LogBody {
    try {
      return JSON.parse(arr.join(' ').trim())
    }
    catch {
      return { transactionId: 'NA', details: 'NA' }
    }
  }

  private generate(file: string): LogItem[] {
    return file
      .split(/\r?\n/) // break into lines
      .filter((line): boolean => !!line) // filter empty lines
      .map((line): LogItem => { // map each line
        const [datetime, , loglevel, , ...arr] = line.split(' ')

        const timestamp = this.parseEpoch(datetime)
        const { transactionId, details } = this.parseLogBody(arr)

        return { timestamp, loglevel, transactionId, details }
      })
      .filter(({ loglevel }): boolean => loglevel === 'error') // filter errors
  }

  private readFile(path: string): Promise<string> {
    return readFile(path, { encoding: 'utf8' })
  }

  private writeLogFile(path: string, data: LogItem[]): Promise<void> {
    return writeFile(path, JSON.stringify(data, null, 2))
  }

  public async readJsonFile(path: string): Promise<object[]> {
    const fileString = await this.readFile(path)
    return JSON.parse(fileString)
  }

  public async process(): Promise<void> {
    const file = await this.readFile(this.inputPath)

    const output = this.generate(file)

    await this.writeLogFile(this.outputPath, output)
  }
}


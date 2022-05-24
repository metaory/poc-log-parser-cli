import { readFile, writeFile } from 'fs/promises'

interface Options {
  input: string
  output: string
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
  public input: string
  public output: string

  constructor(options: Options) {
    this.input = options.input
    this.output = options.output
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

  private writeFile(path: string, data: LogItem[]): Promise<void> {
    return writeFile(path, JSON.stringify(data, null, 2))
  }

  public async process(): Promise<void> {
    const file = await this.readFile(this.input)

    const output = this.generate(file)

    await this.writeFile(this.output, output)
  }
}


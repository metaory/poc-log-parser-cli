import { readFile, writeFile } from 'fs/promises';

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
  input: string;
  output: string;

  constructor(options: Options) {
    this.input = options.input;
    this.output = options.output;
  }

  parseEpoch(date: string): number {
    return new Date(date).getTime()
  }

  parseLogBody(arr: string[] = []): LogBody {
    try {
      return JSON.parse(arr.join(' ').trim())
    }
    catch {
      return { transactionId: 'NA', details: 'NA' }
    }
  }

  generate(file: string): LogItem[] {
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

  async process(): Promise<void> {
    const file = await readFile(this.input, { encoding: 'utf8' })

    const output = this.generate(file)

    await writeFile(this.output, JSON.stringify(output, null, 2))
  }
}


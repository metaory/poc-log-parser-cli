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

const parseEpoch = (date: string): number => new Date(date).getTime()

const parseLogBody = (arr: string[] = []): LogBody => {
  try {
    return JSON.parse(arr.join(' ').trim())
  }
  catch {
    return { transactionId: 'NA', details: 'NA' }
  }
}

const generate = (file: string): LogBody[] => file
  .split(/\r?\n/) // break into lines
  .filter((line): boolean => !!line) // filter empty lines
  .map((line): LogItem => { // map each line
    const [datetime, , loglevel, , ...arr] = line.split(' ')

    const timestamp = parseEpoch(datetime)
    const { transactionId, details } = parseLogBody(arr)

    return { timestamp, loglevel, transactionId, details }
  })
  .filter(({ loglevel }): boolean => loglevel === 'error') // filter errors

export async function processLog(options: Options): Promise<void> {
  const file = await readFile(options.input, { encoding: 'utf8' })

  const output = generate(file)

  await writeFile(options.output, JSON.stringify(output, null, 2))
}

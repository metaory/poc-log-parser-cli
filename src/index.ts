import { readFile, writeFile } from 'fs/promises';

export interface Options {
  input: string
  output: string
}

interface LogBody {
  transactionId: string
  details: string
}

const parseLogBody = (arr: string[] = []): LogBody => {
  let obj: LogBody
  try {
    obj = JSON.parse(arr.join(' ').trim())
  }
  catch {
    obj = { transactionId: 'NA', details: 'NA' }
  }
  finally {
    return obj
  }
}

const parseEpoch = (date: string): number => new Date(date).getTime()

export async function processLog(options: Options): Promise<void> {
  const file = await readFile(options.input, { encoding: 'utf8' })

  const output = file
    .split(/\r?\n/) // break into lines
    .filter(line => !!line) // filter empty lines
    .map(line => { // map each line
      const [datetime, , loglevel, , ...arr] = line.split(' ')

      const { transactionId, details } = parseLogBody(arr)
      const timestamp = parseEpoch(datetime)

      return {
        timestamp,
        loglevel,
        transactionId,
        details
      }
    })
    .filter(({ loglevel }) => loglevel === 'error') // filter errors

  await writeFile(options.output, JSON.stringify(output, null, 2))
}


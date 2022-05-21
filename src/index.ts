import { readFile, writeFile } from 'fs/promises';

export interface Options {
  input: string
  output: string
}

interface JsonMessage {
  transactionId: string
  details: string
}

const parseJson = (arr: string[] = []): JsonMessage => {
  let obj: JsonMessage
  try {
    obj = JSON.parse(arr.join(' ').trim())
  }
  catch {
    obj = { transactionId: 'NA', details: 'NA' }
  }
  finally {
    const { transactionId, details } = obj
    return { transactionId, details }
  }
}

const parseEpoch = (date: string): number => new Date(date).getTime()

export async function init(options: Options): Promise<void> {
  const file = await readFile(options.input, { encoding: 'utf8' })
  const output = file
    .split(/\r?\n/)
    .filter(line => !!line)
    .map(line => {
      const [datetime, , loglevel, , ...arr] = line.split(' ')

      const { transactionId, details } = parseJson(arr)
      const timestamp = parseEpoch(datetime)

      return {
        timestamp,
        loglevel,
        transactionId,
        details
      }
    })
    .filter(({ loglevel }) => loglevel === 'error')

  await writeFile(options.output, JSON.stringify(output, null, 2))
}

//
//
//
// export async function init(options: Options): Promise<{ message: string }> {

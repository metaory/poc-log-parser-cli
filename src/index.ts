export interface Options {
  input: string
  output: string
}

export async function init (options: Options): Promise<{ message: string}> {
  const message = 'you ordered a parse job with: ' + options.input + '  ' + options.output
  console.log(options) 

  return {
    message
  }
}

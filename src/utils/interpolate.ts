import getVariables from './getVariables'

export default function interpolate (content: string, dictionary: Map<string, string>) {
    const variables = getVariables(content)
    let output = content

    variables.forEach((value: string) => {
        switch (value) {
            case '__dirname':
                output = output.replace(/(\#\{__dirname\})/g, process.cwd())
                break
            default:
                output = output.replace(new RegExp('(\#\{' + value + '\})', 'g'), dictionary.get(value) as string)
                break
        }
    })

    return output
}

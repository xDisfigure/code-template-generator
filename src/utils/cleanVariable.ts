
export default function cleanVariable(value: string) {
    return value.replace('#{', '').replace('}', '')
}

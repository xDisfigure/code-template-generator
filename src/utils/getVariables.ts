import uniq from 'lodash/uniq'
import cleanVariable from './cleanVariable'

export default function getVariables(value: string) {
    const match = value.match(/\#\{([A-Za-z_0-9]+)\}/g) || []
    return uniq<string>(match).map(cleanVariable)
}
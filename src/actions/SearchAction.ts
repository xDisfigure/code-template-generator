import interpolate from '../utils/interpolate'
import BaseAction from "./BaseAction";
import searchFolder from "../utils/searchFolder";

export default class SearchAction extends BaseAction {

    public dictionary: Map<string, string>
    public params: any

    constructor(dictionary: Map<string, string>, params: any) {
        super()
        this.params = params
        this.dictionary = dictionary
    }

    async run() {
        const {for: message, variable, type, root} = this.params
        const path = interpolate(root, this.dictionary)

        if (type === 'folder') {
            const result = await searchFolder(path, message)

            this.dictionary.set(variable, result)
            console.log(`[search][folder] setting "${variable}" with "${result}"`)
        }
    }
}
import inquirer from 'inquirer'
import interpolate from '../utils/interpolate'
import BaseAction from "./BaseAction";

export default class AskAction extends BaseAction {
    public dictionary: Map<string, string>
    public params: any

    constructor(dictionary: Map<string, string>, params: any) {
        super()
        this.params = params
        this.dictionary = dictionary
    }

    async run() {
        const {for: message, variable, default_value = null} = this.params

        const answers = await inquirer.prompt([{
            type: 'input',
            name: variable,
            default: default_value ? interpolate(default_value, this.dictionary) : '',
            message,
        }])

        this.dictionary.set(variable, answers[variable])
        console.log(`[ask] setting "${variable}" with "${answers[variable]}"`)
    }
}
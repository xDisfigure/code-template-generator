const yaml = require('js-yaml')
const inquirer = require('inquirer')
const find = require('find')
const _ = require('lodash')
const fs = require('fs')

/**
 * Query could be:
 * - the name of the folder you want to place your file in.
 * - a piece of path until you reach the folder you want to place your file in.
 *
 *  ex:
 *   * absolut path: /usr/test/123/here/i/want
 *   * relative path: here/i/want
 *   * simple name: want/
 *
 * @param root
 *
 * @returns {Promise<void>}
 */
async function searchFolder(root, message) {
    const {FOLDER} = await inquirer.prompt([
        {
            type: 'input',
            name: 'FOLDER',
            message
        }
    ])

    const result = find.dirSync(FOLDER, root);

    const {PATH} = await inquirer.prompt([
        {
            type: 'list',
            name: 'PATH',
            choices: result,
            message: 'Choose the right folder'
        }
    ])

    return PATH
}


function cleanVariable(value) {
    return value.replace('#{', '').replace('}', '')
}

function getVariables(value) {
    const match = value.match(/\#\{([A-Za-z_0-9]+)\}/g) || []
    return _.uniq(match).map(cleanVariable)
}


function interpolate(content, dictionary) {
    const variables = getVariables(content)
    let output = content

    variables.forEach((value) => {
        switch (value) {
            case '__dirname':
                output = output.replace(/(\#\{__dirname\})/g, __dirname)
                break
            default:
                output = output.replace(new RegExp('(\#\{' + value + '\})', 'g'), dictionary.get(value))
                break
        }
    })

    return output
}

function readTemplate(filePath) {
    try {
        return fs.readFileSync(filePath, {encoding: 'utf-8'})
    } catch (e) {
        console.log(e)
    }
}

function getContentFromTemplate(filePath, dictionary) {
    const content = readTemplate(filePath)
    return interpolate(content, dictionary)
}

class BaseAction {
    async run() {
        return null
    }
}

class SearchAction extends BaseAction {
    constructor(dictionary, params) {
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

class AskAction extends BaseAction {
    constructor(dictionary, params) {
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

class CreateAction extends BaseAction {
    constructor(dictionary, params) {
        super()
        this.dictionary = dictionary
        this.params = params
    }

    async run() {
        const {type, outputPath, template, filename} = this.params

        const interpolated = {
            outputPath: interpolate(outputPath, this.dictionary),
            template: interpolate(template, this.dictionary),
            filename: interpolate(filename, this.dictionary)
        }

        switch (type) {
            case 'file':
                const content = template ? getContentFromTemplate(interpolated.template, this.dictionary) : ''
                const filePath = interpolated.outputPath.concat(interpolated.filename)

                fs.writeFileSync(filePath, content)

                console.log('[create][file] ' + filePath + ' created')
                break

            case 'folder':
                break

            default:
        }
    }
}


async function ActionRunner(actions) {
    for (const action of actions) {
        await action.run()
    }
}

async function generate(configPath) {
    let config = null
    let actions = []
    const dictionary = new Map()

    try {
        config = yaml.safeLoad(fs.readFileSync(configPath, 'utf-8'))
    } catch(e) {
        console.log('an error occured while read template yaml file')
        return
    }

    actions = config.template.map((action) => {
        const key = Object.keys(action)[0]

        switch(key) {
            case 'search':
                return new SearchAction(dictionary, action[key])
            case 'ask':
                return new AskAction(dictionary, action[key])
            case 'create':
                return new CreateAction(dictionary, action[key])
            default:
                throw Error('Action not recognized')
        }
    })

    await ActionRunner(actions)
}

generate(__dirname.concat('/component.tpl.yml'))
#!/usr/bin/env node
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import ActionRunner from './ActionRunner'
import SearchAction from "./actions/SearchAction";
import AskAction from "./actions/AskAction";
import CreateAction from "./actions/CreateAction";

type IAskAction = {
    ask: {
        for: string
        variable: string
        default_value?: string
    }
}

type ICreateAction =
    | {
    create: {
        type: 'folder'
        outputPath: string
        foldername: string
        recursive?: boolean
    }
}
    | {
    create: {
        type: 'file'
        outputPath: string
        filename: string
        template?: string
    }
}

type ISearchAction = {
    search: {
        type: 'folder'
        for: string
        variable: string
        root: string
    }
}

type Actions = IAskAction | ICreateAction | ISearchAction

interface IConfig {
    template: Actions[]
}

async function generate(configPath: string) {
    let config = null
    let actions = []
    const dictionary = new Map<string, string>()

    try {
        config = yaml.safeLoad(fs.readFileSync(configPath, 'utf-8')) as IConfig
    } catch (e) {
        console.log('an error occured while read component yaml file')
        return
    }

    actions = config.template.map((action) => {
        const key = Object.keys(action)[0]
        const value = Object.values(action)[0]

        switch (key) {
            case 'search':
                return new SearchAction(dictionary, value)
            case 'ask':
                return new AskAction(dictionary, value)
            case 'create':
                return new CreateAction(dictionary, value)
            default:
                throw Error('Action not recognized')
        }
    })

    await ActionRunner(actions)
}

const argv = process.argv.slice(2);

generate(path.join(process.cwd(), argv[0]))
import fs from 'fs'
import path from 'path'
import interpolate from "../utils/interpolate";
import BaseAction from "./BaseAction";
import readFile from "../utils/readFile";

export default class CreateAction extends BaseAction {

    public dictionary: Map<string, string>
    public params: any

    constructor(dictionary: Map<string, string>, params: any) {
        super()
        this.dictionary = dictionary
        this.params = params
    }

    async run() {
        const {type} = this.params

        switch (type) {
            case 'file': {
                const {outputPath, template, filename} = this.params
                const interpolated = {
                    outputPath: interpolate(outputPath, this.dictionary),
                    template: interpolate(template, this.dictionary),
                    filename: interpolate(filename, this.dictionary)
                }

                let content = ''

                if (template) {
                    content = readFile(interpolated.template)
                    content = interpolate(content, this.dictionary)
                }

                const filePath = path.join(interpolated.outputPath, interpolated.filename)

                try {
                    fs.writeFileSync(filePath, content)
                    console.log(`[create][file] ${filePath} created`)
                } catch (e) {
                    console.log(`[error][create][file] error while writing ${filePath}`)
                }

                break
            }
            case 'folder': {
                const {outputPath, foldername, recursive = false} = this.params
                const interpolated = {
                    outputPath: interpolate(outputPath, this.dictionary),
                    foldername: interpolate(foldername, this.dictionary),
                }

                const folderPath = path.join(interpolated.outputPath, interpolated.foldername)

                try {
                    fs.mkdirSync(folderPath, {recursive})
                    console.log(`[create][folder] ${folderPath} created`)
                } catch (e) {
                    console.log(`[error][create][folder] Error while creating ${folderPath}`)
                }

                break
            }
            default:
        }
    }
}

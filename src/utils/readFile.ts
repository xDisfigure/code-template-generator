import fs from 'fs'

export default function readFile (filePath: string) {
    try {
        return fs.readFileSync(filePath, {encoding: 'utf-8'});
    } catch (e) {
        throw Error(`An error occured while reading file: ${filePath}`);
    }
}
import inquirer from 'inquirer'
import find from 'find'

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
 * @param message
 *
 * @returns {Promise<void>}
 */
export default async function searchFolder(root: string, message: string) {
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
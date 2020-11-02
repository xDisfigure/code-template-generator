import BaseAction from "./actions/BaseAction";

export default async function ActionRunner(actions: BaseAction[]) {
    for (const action of actions) {
        await action.run()
    }
}

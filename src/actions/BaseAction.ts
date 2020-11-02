
interface IBaseAction {
    run(): Promise<void>;
}

export default class BaseAction implements IBaseAction {

    async run()  {
        //
    }
}
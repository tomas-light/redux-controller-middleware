var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ControllerBase_1;
import { inject } from 'cheap-di';
import { waitAction } from './actions/index.js';
import { Middleware } from './middleware/index.js';
import { updateStoreSlice } from './updateStoreSlice.js';
let ControllerBase = ControllerBase_1 = class ControllerBase {
    storeSlice;
    dispatch;
    getState;
    constructor(middleware, storeSlice) {
        this.storeSlice = storeSlice;
        if (new.target === ControllerBase_1) {
            throw new Error('Cannot construct ControllerBase instance directly');
        }
        this.dispatch = (...actions) => middleware?.dispatch(...actions);
        this.getState = () => middleware?.getState();
    }
    /**
     * You may wait until the store will be updated.
     *
     * There is setTimeout(() => resolve) called before returning changed slice in slice reducer.
     *
     * So we assume, the action will be resolved after changes will be applied to the redux state
     * @example
     *   \@reducer
     *   async fetchUsers() {
     *     const users = await this.userApi.get();
     *
     *     await this.updateStoreSlice({
     *       usersList: users,
     *     });
     *
     *     console.log('executed');
     *
     *     const { usersList } = this.getState().users;
     *     console.log(`list is updated ${usersList === users}`);
     *   }
     * */
    async updateStoreSlice(partialStore) {
        const { storeSlice } = this;
        if (!storeSlice) {
            throw new Error('You have to pass storeSlice to ControllerBase\'s "super" to use "this.updateStoreSlice" method');
        }
        await waitAction(updateStoreSlice(storeSlice)(partialStore), this.dispatch);
    }
};
ControllerBase = ControllerBase_1 = __decorate([
    inject(Middleware)
], ControllerBase);
export { ControllerBase };
//# sourceMappingURL=ControllerBase.js.map
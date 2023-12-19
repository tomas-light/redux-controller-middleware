"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStoreSlice = void 0;
const index_js_1 = require("./actions/index.js");
const index_js_2 = require("./decorators/index.js");
function updateStoreSlice(storeSlice) {
    if (!(0, index_js_2.isDecoratedStoreSlice)(storeSlice)) {
        throw new Error('Passed store slice is not decorated with @storeSlice decorator');
    }
    return (partialStore) => {
        return (0, index_js_1.createAction)(storeSlice.update, partialStore);
    };
}
exports.updateStoreSlice = updateStoreSlice;
//# sourceMappingURL=updateStoreSlice.js.map
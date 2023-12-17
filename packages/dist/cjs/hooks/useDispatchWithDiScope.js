"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDispatchWithDiScope = void 0;
const cheap_di_react_1 = require("cheap-di-react");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const addContainerToAction_js_1 = require("./addContainerToAction.js");
/** Warning! it is experimental hook, we don't recommend to use it */
function useDispatchWithDiScope() {
    const dispatch = (0, react_redux_1.useDispatch)();
    const diContext = (0, cheap_di_react_1.useDiContext)();
    const dispatchWithContainerScope = (0, react_1.useCallback)((action) => {
        const newAction = (0, addContainerToAction_js_1.addContainerToAction)(action, diContext);
        return dispatch(newAction);
    }, [dispatch, diContext.container]);
    return dispatchWithContainerScope;
}
exports.useDispatchWithDiScope = useDispatchWithDiScope;
//# sourceMappingURL=useDispatchWithDiScope.js.map
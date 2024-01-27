export function isAction(action) {
    if (typeof action !== 'object' || action == null) {
        return false;
    }
    const actionKeys = [
        //
        'type',
        'actions',
        'payload',
        'stopPropagation',
    ];
    const allKeysPresented = actionKeys.every((key) => key in action);
    return allKeysPresented;
}
//# sourceMappingURL=Action.js.map
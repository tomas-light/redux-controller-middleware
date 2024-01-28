import type { UnknownAction } from 'redux';

export const actionPromises = {
  map: new Map<
    string, // action type
    Array<() => void> // promise resolvers, that should be resolved after action is processed
  >(),

  add: (action: UnknownAction) => {
    let resolvers = actionPromises.map.get(action.type);
    if (!resolvers) {
      resolvers = [];
      actionPromises.map.set(action.type, resolvers);
    }

    return new Promise<void>((resolve) => {
      resolvers?.push(resolve);
    });
  },

  resolveAll: (action: UnknownAction) => {
    const resolvers = actionPromises.map.get(action.type);
    resolvers?.forEach((resolvePromise) => {
      resolvePromise();
    });
    actionPromises.map.delete(action.type);
  },
};

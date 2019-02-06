import { Middleware } from "redux";

interface MiddlewareMapping {
  [key: string]: Middleware;
}

/**
 * Creates a middleware that internally dispatches to all passed in middlewares.
 */
export const compose = (...middlewareList: Middleware[]): Middleware =>
  api => next =>
    middlewareList.reduce(
      (nextMiddleware, middleware) =>
        middleware(api)(nextMiddleware),
      next
    );

/**
 * Combine middlewares but let them operate on a subset of the state (like combineReducers())
 * @param middlewareStateMap keys are sub state keys, values are middlewares
 */
export const combineMiddlewares = (middlewareStateMap: MiddlewareMapping): Middleware =>
  api => next =>
    Object.keys(middlewareStateMap).reduce(
      (nextMiddleware, key) => {
        const middleware = middlewareStateMap[key];
        return middleware({
          dispatch: api.dispatch,
          getState: () => api.getState()[key]
        })(nextMiddleware);
      },
      next
    );

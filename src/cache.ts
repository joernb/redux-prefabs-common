import { FSA } from "flux-standard-action";
import { Dispatch, Middleware } from "redux";

export const cache = <
  State,
  RequestAction extends FSA<any>,
  ResponseAction extends FSA<any>
>(
  {
    requestType,
    responseType,
    respondFromCache,
    child
  }: {
    requestType: RequestAction["type"];
    responseType: ResponseAction["type"];
    respondFromCache: (state: State, interceptActionPayload: RequestAction["payload"]) => ResponseAction["payload"] | void;
    child: Middleware;
  }
): Middleware<Dispatch, State> =>
    api => next => {
      const childActionHandler = child(api)(next);

      return (action: FSA<any>) => {
        if (action.type === requestType) {
          // try to respond from cache
          const cachedPayload = respondFromCache(api.getState(), action.payload);

          // check for cache hit
          if (cachedPayload) {
            // cache hit, respond from cache without actually bothering the nested middleware
            const result = next(action);
            api.dispatch({
              type: responseType,
              payload: cachedPayload
            });
            return result;
          } else {
            // cache miss, forward to nested middleware
            return childActionHandler(action);
          }
        } else {
          // forward all other actions to nested middleware
          return childActionHandler(action);
        }
      };
    }

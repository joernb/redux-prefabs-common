import { FSA } from "flux-standard-action";
import { Middleware, Reducer } from "redux";

export const reduce = <
  State,
  InputAction extends FSA<any>,
  OutputAction extends FSA<any> = FSA<State>
>(
  {
    outputType,
    reducer,
    filter,
    mapper = state => state
  }: {
    outputType: OutputAction["type"];
    reducer: Reducer<State, InputAction>;
    filter?: (state: State) => boolean;
    mapper: (state: State) => OutputAction["payload"];
  }
): Middleware =>
  api => next => {
    let state: State;
    return (action: FSA<any>) => {
      const result = next(action);

      if(!action.error) {
        try {
          const newState = reducer(state, action.payload);
          if (state !== newState) {
            state = newState;
            if (!filter || filter(state)) {
              api.dispatch({
                type: outputType,
                payload: mapper(state)
              });
            }
          }
        } catch(error) {
          api.dispatch({
            type: outputType,
            payload: error,
            error: true
          });
        }
      }

      return result;
    };
  };

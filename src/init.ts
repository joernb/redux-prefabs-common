import { FSA } from "flux-standard-action";
import { Middleware } from "redux";

export const init = (emitAction: FSA<any>): Middleware =>
  api => next => {
    setTimeout(
      () => api.dispatch(emitAction),
      0
    );
    return action => next(action);
  };

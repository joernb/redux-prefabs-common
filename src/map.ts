import { FSA } from "flux-standard-action";
import { Middleware } from "redux";

/**
 * Map one action type to another one with optional filtering.
 */
export const map = <
  InputAction extends FSA<any>,
  OutputAction extends FSA<any>
>(
  {
    inputType,
    outputType,
    map
  }: {
    inputType: InputAction["type"];
    outputType: OutputAction["type"];
    map: (payload: InputAction["payload"]) => OutputAction["payload"];
  }
): Middleware =>
  api => next => (action: InputAction) => {
    const result = next(action);

    if(action.type === inputType && !action.error) {
      try {
        api.dispatch({
          type: outputType,
          payload: map(action.payload)
        });
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

export const mapMany = <
  InputAction extends FSA<any>,
  OutputAction extends FSA<any>
>(
  {
    inputType,
    outputType,
    map
  }: {
    inputType: InputAction["type"];
    outputType: OutputAction["type"];
    map: (payload: InputAction["payload"]) => Array<OutputAction["payload"]>;
  }
): Middleware =>
  api => next => (action: InputAction) => {
    const result = next(action);

    if (action.type === inputType && !action.error) {
      try {
        map(action.payload).map(payload =>
          api.dispatch({
            type: outputType,
            payload
          })
        );
      } catch (error) {
        api.dispatch({
          type: outputType,
          payload: error,
          error: true
        });
      }
    }

    return result;
  };

export const flatMap = <
  InputAction extends FSA<any>,
  OutputAction extends FSA<any>
>(
  {
    inputType,
    outputType,
    map
  }: {
    inputType: InputAction["type"];
    outputType: OutputAction["type"];
    map: (payload: InputAction["payload"]) => OutputAction;
  }
): Middleware =>
  api => next => (action: InputAction) => {
    const result = next(action);

    if (action.type === inputType && !action.error) {
      try {
        api.dispatch(map(action.payload));
      } catch (error) {
        api.dispatch({
          type: outputType,
          payload: error,
          error: true
        });
      }
    }

    return result;
  };
export const flatMapMany = <
  InputAction extends FSA<any>,
  OutputAction extends FSA<any>
>(
  {
    inputType,
    outputType,
    map
  }: {
    inputType: InputAction["type"];
    outputType: OutputAction["type"];
    map: (payload: InputAction["payload"]) => Array<OutputAction>;
  }
): Middleware =>
  api => next => (action: InputAction) => {
    const result = next(action);

    if (action.type === inputType && !action.error) {
      try {
        map(action.payload).map(outputAction =>
          api.dispatch(outputAction)
        );
      } catch (error) {
        api.dispatch({
          type: outputType,
          payload: error,
          error: true
        });
      }
    }

    return result;
  };

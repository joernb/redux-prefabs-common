import { FSA } from "flux-standard-action";
import { Middleware } from "redux";

interface CombineLatest {
  <
    InputAction1 extends FSA<any>,
    OutputAction extends FSA<any>
    >(
    {
      inputTypes,
      outputType,
      mapper,
    }: {
      inputTypes: [InputAction1["type"]],
      outputType: OutputAction["type"];
      mapper: (payloads: [InputAction1["payload"]]) => OutputAction["payload"];
    }
  ): Middleware;
  <
    InputAction1 extends FSA<any>,
    InputAction2 extends FSA<any>,
    OutputAction extends FSA<any>
    >(
    {
      inputTypes,
      outputType,
      mapper,
    }: {
      inputTypes: [InputAction1["type"], InputAction2["type"]],
      outputType: OutputAction["type"];
      mapper: (payloads: [InputAction1["payload"], InputAction2["payload"]]) => OutputAction["payload"];
    }
  ): Middleware;
  <
    InputAction1 extends FSA<any>,
    InputAction2 extends FSA<any>,
    InputAction3 extends FSA<any>,
    OutputAction extends FSA<any>
    >(
    {
      inputTypes,
      outputType,
      mapper,
    }: {
      inputTypes: [InputAction1["type"], InputAction2["type"], InputAction3["type"]],
      outputType: OutputAction["type"];
      mapper: (payloads: [InputAction1["payload"], InputAction2["payload"], InputAction3["payload"]]) => OutputAction["payload"];
    }
  ): Middleware;
}

export const combineLatest: CombineLatest = (
  {
    inputTypes,
    outputType,
    mapper
  }: {
    inputTypes: any[];
    outputType: FSA<any>;
    mapper: (payloads: any[]) => any;
  }
): Middleware =>
  api => next => {
    // store latest actions
    const latest = {};

    return (action: FSA<any>) => {
      const result = next(action);

      if(!action.error && inputTypes.indexOf(action.type) > -1) {
        latest[action.type] = action;

        if(inputTypes.every(inputType => latest[inputType]["payload"])) {
          const payloads = inputTypes.map(inputType => latest[inputType]);
          try {
            api.dispatch({
              type: outputType,
              payload: mapper(payloads)
            });
          } catch(error) {
            api.dispatch({
              type: outputType,
              payload: error,
              error: true
            });
          }
        }
      }

      return result;
    };
  };

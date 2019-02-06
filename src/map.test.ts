import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { FSA } from "flux-standard-action";
import { map } from "./map";

interface FooAction extends FSA<string> {
  type: "Foo";
}

const fooAction: FooAction = {
  type: "Foo",
  payload: "hello"
};

interface BarAction extends FSA<number> {
  type: "Bar";
}

const barAction: BarAction = {
  type: "Bar",
  payload: 42
};

describe("map", () => {
  let api: MiddlewareAPI<Dispatch<AnyAction>, {}>;
  let next: Dispatch<AnyAction>;

  beforeEach(() => {
    api = {
      dispatch: jest.fn(),
      getState: jest.fn()
    };
    next = jest.fn();
  });

  it("should map payload", () => {
    const actionHandler = map<FooAction, BarAction>({
      inputType: "Foo",
      outputType: "Bar",
      mapper: (foo) => 42
    })(api)(next);
    actionHandler(fooAction);

    expect(api.dispatch).toHaveBeenCalledTimes(1);
    expect(api.dispatch).toHaveBeenNthCalledWith(1, barAction);
  });
});

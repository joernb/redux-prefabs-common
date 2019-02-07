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

const barAction1: BarAction = {
  type: "Bar",
  payload: 42
};

const barAction2: BarAction = {
  type: "Bar",
  payload: 43
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

  it("should map", () => {
    const actionHandler = map<FooAction, BarAction>({
      inputType: "Foo",
      outputType: "Bar",
      map: (foo) => 42
    })(api)(next);
    actionHandler(fooAction);

    expect(api.dispatch).toHaveBeenCalledTimes(1);
    expect(api.dispatch).toHaveBeenNthCalledWith(1, barAction1);
  });

  it("should map many", () => {
    const actionHandler = map<FooAction, BarAction>({
      inputType: "Foo",
      outputType: "Bar",
      mapMany: (foo) => [42, 43]
    })(api)(next);
    actionHandler(fooAction);

    expect(api.dispatch).toHaveBeenCalledTimes(2);
    expect(api.dispatch).toHaveBeenNthCalledWith(1, barAction1);
    expect(api.dispatch).toHaveBeenNthCalledWith(2, barAction2);
  });

  it("should flatMap", () => {
    const actionHandler = map<FooAction, BarAction>({
      inputType: "Foo",
      outputType: "Bar",
      flatMap: (foo) => barAction1
    })(api)(next);
    actionHandler(fooAction);

    expect(api.dispatch).toHaveBeenCalledTimes(1);
    expect(api.dispatch).toHaveBeenNthCalledWith(1, barAction1);
  });

  it("should flatMap many", () => {
    const actionHandler = map<FooAction, BarAction>({
      inputType: "Foo",
      outputType: "Bar",
      flatMapMany: (foo) => [barAction1, barAction2]
    })(api)(next);
    actionHandler(fooAction);

    expect(api.dispatch).toHaveBeenCalledTimes(2);
    expect(api.dispatch).toHaveBeenNthCalledWith(1, barAction1);
    expect(api.dispatch).toHaveBeenNthCalledWith(2, barAction2);
  });
});

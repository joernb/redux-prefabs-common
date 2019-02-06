import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { FSA } from "flux-standard-action";
import { isolate } from "./isolate";

interface FooAction extends FSA<void> {
  type: "Foo";
}

interface BarAction extends FSA<void> {
  type: "Bar";
}

const fooAction: FooAction = {
  type: "Foo"
};

const barAction: BarAction = {
  type: "Bar"
};

describe("isolate", () => {
  let api: MiddlewareAPI<Dispatch<AnyAction>, {}>;
  let next: Dispatch<AnyAction>;

  let nestedActionHandler: (action: any) => any;
  let nestedMiddleware: Middleware;

  beforeEach(() => {
    api = {
      dispatch: jest.fn(),
      getState: jest.fn()
    };
    next = jest.fn();
    nestedMiddleware = nestedApi => nestedNext => nestedActionHandler = jest.fn(action => nestedNext(action));
  });

  it("should forward actions", () => {
    const actionHandler = isolate({
      nested: nestedMiddleware
    })(api)(next);
    actionHandler(fooAction);
    actionHandler(barAction);

    expect(nestedActionHandler).toHaveBeenCalledTimes(2);
    expect(nestedActionHandler).toHaveBeenNthCalledWith(1, fooAction);
    expect(nestedActionHandler).toHaveBeenNthCalledWith(2, barAction);
  });

  it("should forward actions in whitelist but block others", () => {
    const actionHandler = isolate({
      nested: nestedMiddleware,
      whitelist: ["Foo"]
    })(api)(next);
    actionHandler(fooAction);
    actionHandler(barAction);

    expect(nestedActionHandler).toHaveBeenCalledTimes(1);
    expect(nestedActionHandler).toHaveBeenNthCalledWith(1, fooAction);
  });

  it("should block actions in blacklist but forward others", () => {
    const actionHandler = isolate({
      nested: nestedMiddleware,
      blacklist: ["Foo"]
    })(api)(next);
    actionHandler(fooAction);
    actionHandler(barAction);

    expect(nestedActionHandler).toHaveBeenCalledTimes(1);
    expect(nestedActionHandler).toHaveBeenNthCalledWith(1, barAction);
  });
});

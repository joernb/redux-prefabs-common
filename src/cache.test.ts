import { FSA } from "flux-standard-action";
import { Action, AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { cache } from "./cache";

interface FooId {
  key: string;
}

interface Foo {
  value: string;
}

interface LoadFooAction extends FSA<FooId> {
  type: "LoadFooAction";
}

interface FooLoadedAction extends FSA<Foo> {
  type: "FooLoadedAction";
}

interface State {
  [key: string]: Foo;
}

describe("cache", () => {
  let api: MiddlewareAPI<Dispatch<AnyAction>, State>;
  let next: Dispatch<AnyAction>;

  let innerActionHandler: (action: any) => any;
  let innerMiddleware: Middleware;

  let middleware: Middleware;
  let actionHandler: (action: any) => any;

  const loadFooAction: LoadFooAction = {
    type: "LoadFooAction",
    payload: {
      key: "abc"
    }
  };

  const fooLoadedAction: FooLoadedAction = {
    type: "FooLoadedAction",
    payload: {
      value: "cachedvalue"
    }
  };

  const otherAction: Action = {
    type: "Other",
  };

  const emptyCacheState: State = {
  };

  const filledCacheState: State = {
    "abc": {
      value: "cachedvalue"
    }
  };

  beforeEach(() => {
    api = {
      dispatch: jest.fn(),
      getState: jest.fn()
    };
    next = jest.fn();
    // emulate simple inner middleware that forwards actions to next
    innerMiddleware = innerApi => innerNext => innerActionHandler = jest.fn(action => innerNext(action));

    middleware = cache<State, LoadFooAction, FooLoadedAction>({
      requestType: "LoadFooAction",
      responseType: "FooLoadedAction",
      respondFromCache: (state: State, fooId: FooId) => state[fooId.key],
      child: innerMiddleware
    });
    actionHandler = middleware(api)(next);
  });

  it("should forward other actions to inner middleware", () => {
    actionHandler(otherAction);
    expect(innerActionHandler).toHaveBeenNthCalledWith(1, otherAction);
    expect(next).toHaveBeenNthCalledWith(1, otherAction);
  });

  it("should intercept but forward on cache miss", () => {
    api.getState = jest.fn(() => emptyCacheState);
    actionHandler(loadFooAction);
    expect(innerActionHandler).toHaveBeenNthCalledWith(1, loadFooAction);
    expect(api.dispatch).not.toHaveBeenCalled();
  });

  it("should intercept and not forward but emit on cache hit", () => {
    api.getState = jest.fn(() => filledCacheState);
    actionHandler(loadFooAction);
    expect(next).toHaveBeenNthCalledWith(1, loadFooAction);
    expect(api.dispatch).toHaveBeenNthCalledWith(1, fooLoadedAction);
  });

});

import { Middleware } from "redux";
import { FSA } from "flux-standard-action";

export const isolate = (
  {
    nested,
    blacklist,
    whitelist
  }: {
    nested: Middleware;
    blacklist?: string[];
    whitelist?: string[];
  }
): Middleware =>
  api => next => {
    const actionHandler = nested(api)(next);

    const isFiltered = (action: FSA<any>) =>
      (blacklist && blacklist.some(entry => entry === action.type)) ||
      (whitelist && !whitelist.some(entry => entry === action.type));

    return (action: FSA<any>) =>
      isFiltered(action) ? undefined : actionHandler(action);
  };

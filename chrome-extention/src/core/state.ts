import type { Rgb } from "./hardLight.js";

export type AppState =
  | { status: "idle" }
  | { status: "basePicked"; base: Rgb }
  | {
      status: "success";
      base: Rgb;
      result: Rgb;
      blend: Rgb;
      copiedText: string;
    }
  | { status: "error"; message: string; base?: Rgb };

export type AppEvent =
  | { type: "BASE_PICKED"; base: Rgb }
  | { type: "BASE_PICK_CANCELED" }
  | { type: "RESULT_PICK_CANCELED" }
  | { type: "RESULT_RESOLVED"; result: Rgb; blend: Rgb; copiedText: string }
  | { type: "RESULT_FAILED"; message: string }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };

export const initialState: AppState = { status: "idle" };

export function transition(state: AppState, event: AppEvent): AppState {
  if (event.type === "RESET") {
    return initialState;
  }

  if (event.type === "BASE_PICKED") {
    return { status: "basePicked", base: event.base };
  }

  if (event.type === "BASE_PICK_CANCELED" || event.type === "RESULT_PICK_CANCELED") {
    return state;
  }

  if (event.type === "ERROR") {
    if (state.status === "basePicked" || state.status === "success") {
      return { status: "error", message: event.message, base: state.base };
    }

    if (state.status === "error") {
      return { ...state, message: event.message };
    }

    return { status: "error", message: event.message };
  }

  if (state.status !== "basePicked") {
    return state;
  }

  if (event.type === "RESULT_FAILED") {
    return { status: "error", base: state.base, message: event.message };
  }

  if (event.type === "RESULT_RESOLVED") {
    return {
      status: "success",
      base: state.base,
      result: event.result,
      blend: event.blend,
      copiedText: event.copiedText,
    };
  }

  return state;
}

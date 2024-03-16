// Listeners
export interface GenericListener {
  id: string;
  type: string;
}

export interface KeydownListener extends GenericListener {
  key: string;
}

export interface TimerListener {
  type: string;
  interval: number;
}

// Triggers
export interface GenericTrigger {
  id: string;
  type: string;
}

export interface SwapTrigger extends GenericTrigger {
  id: string;
  value: string;
}

export type ValueTrigger = GenericTrigger;

export type MAMLNode =
  | GenericListener
  | KeydownListener
  | TimerListener
  | GenericTrigger
  | SwapTrigger;

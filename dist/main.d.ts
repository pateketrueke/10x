export interface EvalInfo {
  enabled: boolean;
  depth: number;
  calls: any[];
}

export interface EvalResult {
  result: any;
  error: Error | null;
  info: EvalInfo;
}

export interface ExecuteResult {
  failure: Error | null;
  value: any;
  info: EvalInfo;
}

export function evaluate(tokens: any, environment?: any, enabledDetail?: boolean): Promise<EvalResult>;
export function execute(code: string, environment?: any, enabledDetail?: boolean): Promise<any>;
export function useCurrencies(): Promise<void>;

export class Env {
  constructor(parent?: Env);
  get(key: string): any;
  set(key: string, value: any): void;
  define(key: string, value: any): void;
  static import(path: string): Promise<any>;
  static resolve(path: string): string;
}

export class Expr {
  static readonly Unit: any;
}

export class Parser {
  static getAST(code: string, ...args: any[]): any;
  static sub(template: string): any;
}

export function main(argv?: string[]): Promise<any>;
export function format(value: any): string;

export class Token {
  constructor(type: any, text: string, value?: any, tokenInfo?: any);
  value: any;
  type: any;
  line: number;
  col: number;
  isRaw: boolean;
  isMulti: boolean;
  isMarkup: boolean;
}

export function debug(...args: any[]): void;
export function serialize(value: any): string;
export function deindent(str: string): string;
export function hasDiff(a: any, b: any): boolean;
export function copy<T>(value: T): T;
export function repr(value: any): string;
export function raise(message: string): never;
export function assert(condition: boolean, message?: string): void;
export function check<T>(value: T, message?: string): T;
export function argv(args?: string[]): string[];
export function only<T>(arr: T[], message?: string): T;

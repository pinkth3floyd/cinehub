declare global {
  interface Window {
    Splide: any;
  }
}

export interface SplideOptions {
  type?: string;
  perPage?: number;
  drag?: boolean;
  pagination?: boolean;
  arrows?: boolean;
  autoplay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  speed?: number;
  gap?: number;
  rewind?: boolean;
  rewindSpeed?: number;
  height?: string;
  cover?: boolean;
  focus?: string;
}

export interface SplideInstance {
  mount(): void;
  destroy(): void;
  refresh(): void;
  go(index: number): void;
  go('>', index?: number): void;
  go('<', index?: number): void;
  go('+', index?: number): void;
  go('-', index?: number): void;
  go('>>'): void;
  go('<<'): void;
  go('>', index?: number): void;
  go('<', index?: number): void;
  go('+', index?: number): void;
  go('-', index?: number): void;
  go('>>'): void;
  go('<<'): void;
  on(event: string, callback: Function): void;
  off(event: string, callback?: Function): void;
  emit(event: string, ...args: any[]): void;
  add(slide: HTMLElement | string, index?: number): void;
  remove(index: number): void;
  refresh(): void;
  destroy(): void;
  mount(): void;
  Components: any;
  options: SplideOptions;
  state: any;
  root: HTMLElement;
  track: HTMLElement;
  list: HTMLElement;
  slides: HTMLElement[];
  length: number;
  index: number;
}

declare class Splide {
  constructor(selector: string | HTMLElement, options?: SplideOptions);
  mount(): void;
  destroy(): void;
  refresh(): void;
  go(index: number): void;
  go('>', index?: number): void;
  go('<', index?: number): void;
  go('+', index?: number): void;
  go('-', index?: number): void;
  go('>>'): void;
  go('<<'): void;
  on(event: string, callback: Function): void;
  off(event: string, callback?: Function): void;
  emit(event: string, ...args: any[]): void;
  add(slide: HTMLElement | string, index?: number): void;
  remove(index: number): void;
  Components: any;
  options: SplideOptions;
  state: any;
  root: HTMLElement;
  track: HTMLElement;
  list: HTMLElement;
  slides: HTMLElement[];
  length: number;
  index: number;
}

export {}; 
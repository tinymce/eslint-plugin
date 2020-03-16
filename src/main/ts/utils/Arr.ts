export const exists = <T>(xs: ReadonlyArray<T>, f: (x: T) => boolean) => xs.findIndex(f) !== -1;

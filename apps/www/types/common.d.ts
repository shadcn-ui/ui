type Pretty<T> = {
    [K in keyof T]: T[K]
} & {}

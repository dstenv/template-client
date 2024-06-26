/** 将某一项变可选 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

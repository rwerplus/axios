import { RejectedFn, ResolvedFn } from '../types';
interface Interceptor<T> {
    resolved: ResolvedFn<T>;
    rejected?: RejectedFn<T>;
}
export default class InterceptorManager<T> {
    private readonly interceptors;
    constructor();
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn<T>): number;
    eject(id: number): void;
    forEach(fn: (internal: Interceptor<T>) => void): void;
}
export {};

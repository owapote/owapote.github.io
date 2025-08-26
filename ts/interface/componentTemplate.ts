//抽象メソッド(throwなのでnever指定)
export function BaseLoadMustOverride(): never{
    throw new Error("派生クラスで実装をしてね");
}

//同期も非同期も対応
export type LoadFunction = () => void | Promise<void>;

/**
 * Loadの静的付与(天才)
 * @param component React.ComponentType<T>
 * @param loadFunction Loadとして使う関数(必要なければ空のラムダ式にする)
 * @returns 
 */
export function SetBaseFunction<T>(
    component: React.ComponentType<T>,
    loadFunction : LoadFunction = BaseLoadMustOverride
) : React.ComponentType<T> & { Load: LoadFunction } {
    const ret = component as React.ComponentType<T> & { Load: LoadFunction};
    ret.Load = loadFunction;
    return ret;
}
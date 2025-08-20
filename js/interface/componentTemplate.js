//抽象メソッド
export function BaseLoadMustOverride() {
    throw new Error("派生クラスで実装をしてね");
}

//Loadの静的付与(天才)
export function SetBaseFunction(component, loadFunction = BaseLoadMustOverride) {
    component.Load = loadFunction;
    return component;
}
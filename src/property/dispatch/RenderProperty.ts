import { IndexBuffer } from "../../res/buffer/IndexBuffer";
import { BaseProperty } from "../BaseProperty";

class RenderProperty extends BaseProperty {

    constructor(buffer: IndexBuffer);
    constructor(maxDrawCount: number, instanceCount: number);
    constructor(a?: any, b?: any) {
        if (a instanceof IndexBuffer) {
            super("[render]", "DrawIndexed");
        } else if (typeof a === "number" && typeof b === "number") {
            super("[render]", "DrawCount")
        } else {

        }
    }

}

export {
    RenderProperty
}
import { BaseProperty } from "../BaseProperty";

/**
 * 
 * support dynamic work size 
 * - x: WorkSizeHandle
 * - y: WorkSizeHandle
 * - z: WorkSizeHandle
 * 
 */
type WorkSizeHandle = { (): number; }

/**
 * 
 * @class ComputeProperty
 * 
 */
class ComputeProperty extends BaseProperty {

    /**
     * 
     */
    private groupX?: number;

    /**
     * 
     */
    private groupY?: number;

    /**
     * 
     */
    private groupZ?: number;

    /**
     * 
     */
    private hanlderX?: WorkSizeHandle;

    /**
     * 
     */
    private hanlderY?: WorkSizeHandle;

    /**
     * 
     */
    private hanlderZ?: WorkSizeHandle;

    /**
     * 
     * @param [number|WorkSizeHandle] x 
     * @param [number|WorkSizeHandle] y 
     * @param [number|WorkSizeHandle] z 
     * 
     */
    constructor(x: WorkSizeHandle, y: number, z: number)
    constructor(x: WorkSizeHandle, y: WorkSizeHandle, z: number)
    constructor(x: WorkSizeHandle, y: WorkSizeHandle, z: WorkSizeHandle)
    constructor(x: number, y: number, z: number)
    constructor(a: number | WorkSizeHandle, b: number | WorkSizeHandle, c: number | WorkSizeHandle) {
        super('compute property', 'computeDispatch');
        // input a
        if (typeof a === 'number') {
            this.groupX = a;
        } else if (typeof a === "function" && a.length === 0) {
            this.hanlderX = a;
        }
        // input b
        if (typeof b === 'number') {
            this.groupY = b;
        } else if (typeof b === "function" && b.length === 0) {
            this.hanlderY = b;
        }
        // input c
        if (typeof c === 'number') {
            this.groupZ = c;
        } else if (typeof c === "function" && c.length === 0) {
            this.hanlderZ = c;
        }
    }

    /**
     * 
     * @returns 
     */
    getGroupX = (): number => {
        if (this.hanlderX) {
            return this.hanlderX();
        }
        return this.groupX as number;
    }

    /**
     * 
     * @returns 
     */
    getGroupY = (): number => {
        if (this.hanlderY) {
            return this.hanlderY();
        }
        return this.groupY as number;
    }

    /**
     * 
     * @returns 
     */
    getGroupZ = (): number => {
        if (this.hanlderZ) {
            return this.hanlderZ();
        }
        return this.groupZ as number;
    }

}

export {
    ComputeProperty
}
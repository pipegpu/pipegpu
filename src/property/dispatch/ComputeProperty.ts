import { BaseProperty } from "../BaseProperty";

/**
 * 
 */
class ComputeProperty extends BaseProperty {
    /**
     * 
     */
    private groupX: number;

    /**
     * 
     */
    private groupY: number;

    /**
     * 
     */
    private groupZ: number;

    /**
     * 
     * @param x 
     * @param y 
     * @param z 
     */
    constructor(x: number, y: number, z: number) {
        super('compute property', 'computeDispatch');
        this.groupX = x;
        this.groupY = y;
        this.groupZ = z;
    }

    /**
     * 
     * @returns 
     */
    getGroupX = (): number => {
        return this.groupX;
    }

    /**
     * 
     * @returns 
     */
    getGroupY = (): number => {
        return this.groupY;
    }

    /**
     * 
     * @returns 
     */
    getGroupZ = (): number => {
        return this.groupZ;
    }
}

export {
    ComputeProperty
}
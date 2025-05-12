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
        super('compute property', 'ComputeDispatch');
        this.groupX = x;
        this.groupY = y;
        this.groupZ = z;
    }

    getGroupX = (): number => {
        return this.groupX;
    }

    getGroupY = (): number => {
        return this.groupY;
    }

    getGroupZ = (): number => {
        return this.groupZ;
    }
}

export {
    ComputeProperty
}
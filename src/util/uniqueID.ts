/**
 * A simple unique ID generator.
 */
let idx: number = 1;
const uniqueID = (): number => {
    return idx++;
}

export {
    uniqueID
}
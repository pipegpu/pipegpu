/**
 * reference:
 * https://github.com/KIWI-ST/pipegl/blob/master/src/state/StringState.ts
 * 
 * @example
 * const stringState = new StringState();
 * stringState.id(`112`);
 * stringState.str(1);
 */
class StringState {

    /**
     * 
     */
    private static STRINGSTATE_SET: Map<string, number> = new Map();

    /**
     * 
     */
    private stringValues: string[] = [];

    /**
     * 
     * @param key 
     * @returns 
     */
    hasKey = (key: string): boolean => {
        return StringState.STRINGSTATE_SET.has(key);
    }

    /**
     * 
     * @param str 
     * @returns 
     */
    id = (str: string): number => {
        let result = StringState.STRINGSTATE_SET.get(str);
        if (result) {
            return result;
        }
        result = this.stringValues.length;
        StringState.STRINGSTATE_SET.set(str, result);
        this.stringValues.push(str);
        return result;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    str = (id: number): string => {
        return this.stringValues[id];
    }

}

export {
    StringState
}
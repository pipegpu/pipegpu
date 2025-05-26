import type { Compiler } from "../../src";
import { uniqueID } from "../../src/util/uniqueID";

/**
 * 
 */
type ShaderSnippetType =
    'kDebugSnippet' |
    'kStorageU32AtomicSnippet' |
    'kStorageAtomicArrayU32Snippet' |
    'kFragmentSnippet'
    ;

/**
 * 
 */
interface IShaderSnippetCode {
    shaderCode: string,
    variableCode: string,
    variableName: string,
    structName: string,
    requireExtentCode: string
}

/**
 * 
 */
abstract class BaseShaderSnippet {
    /**
     * 
     */
    private id: number = uniqueID();

    /**
     * 
     */
    protected compiler: Compiler;

    /**
     * 
     */
    protected snippetType: ShaderSnippetType;

    /**
     * 
     */
    protected shaderSnippetCode: IShaderSnippetCode;;

    /**
     * 
     * @param complier 
     * @param snippetType 
     */
    constructor(complier: Compiler, snippetType: ShaderSnippetType) {
        this.compiler = complier;
        this.snippetType = snippetType;
        this.shaderSnippetCode = {
            shaderCode: '',
            variableCode: '',
            variableName: '',
            structName: '',
            requireExtentCode: ''
        };
    }

    /**
     * 
     * @returns 
     */
    getID(): number {
        return this.id;
    }

    /**
     * 
     * @returns 
     */
    protected getAutoIncreasedID = (): number => {
        return uniqueID();
    }

    /**
     * 
     * @param groupIndex 
     * @param bindingIndex 
     * @param shaderCodeType 
     */
    abstract getShaderCode(groupIndex: number, bindingIndex: number, shaderCodeType: 'kRender' | 'kCompute'): string;
}

export {
    BaseShaderSnippet
}
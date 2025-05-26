import type { Compiler, Context } from "../../src";
import type { BaseShaderSnippet } from "./BaseShaderSnippet";

abstract class BaseShaderComponent {
    /**
     * 
     */
    protected ctx: Context;

    /**
     * 
     */
    protected compiler: Compiler;

    /**
     * 
     */
    private snippets: BaseShaderSnippet[] = [];

    /**
     * 
     * @param ctx 
     * @param compiler 
     */
    constructor(ctx: Context, compiler: Compiler) {
        this.ctx = ctx;
        this.compiler = compiler;
    }

    /**
     * 
     * @param snippet 
     * @returns 
     */
    append(snippet: BaseShaderSnippet): void {
        const uniqueIDset = new Set(this.snippets.map(s => s.getID));
        if (uniqueIDset.has(snippet.getID)) {
            console.warn(`[I][BaseShaderComponent][append] snippet with id ${snippet.getID()} already exists.`);
            return;
        }
        this.snippets.push(snippet);
    }

    /**
     * 
     */
    abstract build(): string;
}


export {
    BaseShaderComponent
}
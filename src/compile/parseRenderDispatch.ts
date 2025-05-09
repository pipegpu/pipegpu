import type { RenderProperty } from "../property/dispatch/RenderProperty"
import type { PropertyFormat } from "../res/Format";

const parseRenderDispatch = (dispatch: RenderProperty): void => {
    if (!dispatch) {
        console.log(`[E][parseRenderDispatch] missing render 'dispatch' in 'RenderHolderDesc'`);
    }

    const t: PropertyFormat = dispatch.getPropertyFormat();
    switch (t) {
        default:
            break;
    }
}

export {
    parseRenderDispatch
}
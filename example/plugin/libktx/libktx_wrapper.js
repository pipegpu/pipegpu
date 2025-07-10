let ktx, initPromise;

export async function LoadLIBKTX() {
    if (ktx) {
        return ktx;
    }
    if (initPromise) {
        return initPromise;
    }
    initPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const url = new URL(import.meta.url);
        const libktxWapper = url.origin + url.pathname;
        const libktx = libktxWapper.replace('libktx_wrapper.js', 'libktx.js');       
        script.src = libktx;
        document.head.appendChild(script);
        script.onload = async () => {
            try {
                const ktx = await createKtxModule();
                resolve(ktx);
            }
            catch (error) {
                reject(error);
            }
        }
        script.onerror = reject;
    });
    return initPromise;
}

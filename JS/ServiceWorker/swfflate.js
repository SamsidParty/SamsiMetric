AutoLoadThisFile();

if (typeof window !== 'undefined') {
    //This Code Will Run On The Client

    window.SWFFlate = {
        decompressAsync: async (data) => {
            if (!!window.CurrentWorkbox) {
                return await window.CurrentWorkbox.messageSW({ type: "DECODE_FFLATE", content: data });
            }
            else {
                return fflate.decompressSync(data);
            }
        }
    }
}
else {
    //This Code Will Run On The Service Worker
    self.addEventListener('message', (e) => {
        if (e.data.type === 'DECODE_FFLATE') {
            if (LoadedDependencies.includes("./JS/ThirdParty/fflate.js")) {
                var decoded = fflate.decompressSync(e.data.content);
                e.ports[0].postMessage(decoded);
            }
        }
    });

}
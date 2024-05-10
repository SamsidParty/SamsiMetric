
AutoLoadThisFile();

if (typeof window !== 'undefined') {
    //This Code Will Run On The Client

    window.SWMessagePack = {
        decodeAsync: async (data) => {
            if (!!window.CurrentWorkbox) {
                return await window.CurrentWorkbox.messageSW({ type: "DECODE_MSGPACK", content: data });
            }
            else {
                return MessagePack.decode(data);
            }
        }
    }
}
else {
    //This Code Will Run On The Service Worker
    
    //Decodes The MessagePack Data On A Seperate Thread, Preventing Lag On The Client
    //MessagePack.decodeAsync Throws Errors, So This Is The Better Solution
    self.addEventListener('message', (e) => {
        if (e.data.type === 'DECODE_MSGPACK') {
            if (LoadedDependencies.includes("./JS/ThirdParty/msgpack.js")) {
                var decoded = MessagePack.decode(e.data.content);
                e.ports[0].postMessage(decoded);
            }
        }
    });

}
var LoadedDependencies = [];

var AutoLoadThisFile = () => {}; // Stub

self.addEventListener('message', (e) => {
    if (e.data.type === 'LOAD_DEPENDENCY') {
        if (!LoadedDependencies.includes(e.data.name)) {
            eval(e.data.content);
            console.log(`Loaded Into Service Worker ${e.data.name} (${e.data.content.length} bytes)`);
            LoadedDependencies.push(e.data.name);
        }

    }
});
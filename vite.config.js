// vite.config.js
import react from '@vitejs/plugin-react';

export default {
    plugins: [react()],
    base: '/', //user repo
    server: {
        host: "127.0.0.1",
        port: 3000, //localhost
        strictPort: false,
        hmr: { host: '127.0.0.1' },
        proxy: { //CORSの回避
            '/youtube': {
                target: 'https://owapoteweb.owapote0914.workers.dev',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/youtube/, ''),
            },
        },
    },
    root: '.',      //index.htmlの位置
    build: {
        outDir: 'publish'
    }
};

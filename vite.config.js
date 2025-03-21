import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 获取当前文件的路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前文件所在的目录
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    }
});  
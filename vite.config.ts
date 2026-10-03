import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // Встроенный браузер открывает localhost как 127.0.0.1.
    // Иначе Vite слушает только IPv6, и браузер получает ошибку -102.
    host: '127.0.0.1',
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          './src/scss'
        ],
      },
    },
  },
})
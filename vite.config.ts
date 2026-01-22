import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 核心：设为相对路径，打包后资源引用以./开头
  base: './', 
  build: {
    outDir: 'dist', // 打包输出目录（默认）
  },
})

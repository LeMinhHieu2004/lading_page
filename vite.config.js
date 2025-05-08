import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/lading_page/', // Thêm dòng này để cấu hình base URL
  plugins: [react()],
})
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true,
      disableStaticImages: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    compiler: {
      removeConsole: process.env.NEXT_PUBLIC_HOST_URL === "https://oms.systemiic.com",
    },
    output: "standalone",
    webpack(config, { dev }) {
      if (dev) {
        config.devtool = 'cheap-module-source-map'; // 디버깅을 위한 소스 맵 설정
      }
      return config;
    },
    devIndicators: {
      autoPrerender: false, // 자동 프리렌더링 비활성화
    },
    webpackDevMiddleware: (config) => {
      config.watchOptions = {
        // poll: 1000, // 파일 변경 감지 주기 설정
        // aggregateTimeout: 300, // 300ms 대기 후 변경 감지
        ignored: /node_modules/, // 노드 모듈 제외
      };
      return config;
    },
  };
  
  export default nextConfig;
  
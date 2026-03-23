FROM public.ecr.aws/docker/library/node:22.14.0-alpine3.21

# 1. 작업 디렉터리 설정
WORKDIR /application

# 2. 작업 디렉터리 권한 설정 (보안)
RUN chown -R node:node /application
USER node

# 3. npm 설치 확인
RUN npm --version

# 4. package.json 및 package-lock.json 복사
COPY package*.json ./

# 5. 프로덕션 의존성 설치
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# 6. 빌드된 결과물 복사
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY next.config.mjs ./
COPY run_server.js ./


# 7. 환경 변수 설정
ENV NEXT_TELEMETRY_DISABLED=1

# 8. 포트 개방 및 실행 명령
EXPOSE 3000
CMD ["node", "run_server.js"]    
#!/bin/bash

set -e  # 에러 발생 시 스크립트 즉시 종료

echo "🚀 BUILD START"

# 1. 의존성 설치
echo "📦 Installing dependencies..."
echo "⏱ npm install START"
date
npm install
echo "⏱ npm install END"
date

# 2. 환경파일 복사
if [ ! -z "$RUN_ENV" ] && [ "$RUN_ENV" == "dev" ]; then
    echo "🌱 Setting environment: .env.development.target → .env"
    cp -p .env.development.target .env >> ./copylog.txt 2>&1
    echo "✅ .env.development.target 파일 복사 완료"
else
    echo "🌱 Setting environment: .env.production.target → .env"
    cp -p .env.production.target .env >> ./copylog.txt 2>&1
    echo "✅ .env.production.target 파일 복사 완료"
fi

# 3. 빌드 실행
echo "🛠 Running build..."
echo "⏱ next build START"
date
npm run build
echo "⏱ next build END"
date

echo "✅ BUILD 완료!"

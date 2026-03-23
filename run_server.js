/**	Next.js 및 기타 필요 모듈 불러오기 **/
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

/** 애플리케이션 설정 **/
const dev = false;
const hostname = "localhost";
const port = 3000;

/**
 * Next.js 애플리케이션의 인스턴스를 생성합니다.
 * 여기서 dev는 개발 모드 여부를 나타내며, hostname과 port는 서버의 호스트 이름과 포트 번호를 설정합니다.
 */
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      /**
       * app.render 메소드를 사용하여 특정 경로에 대한 요청을 Next.js 페이지로 라우팅합니다.
       * 이 메소드는 Next.js 애플리케이션 인스턴스의 기능으로, 특정 요청을 처리하고 적절한 페이지를 렌더링합니다.
       */
      // const path2Url = '<http://example.com/url2>';
      // const path1Url = '<http://example.com/url1>';
      // if (pathname === '/path1') {
      //   await app.render(req, res, '/path1', query)
      //   await axios.get(path1Url);  // 추적할 URL 호출
      // } else if (pathname === '/path2') {
      //   await app.render(req, res, '/path2', query);
      //   await axios.get(path2Url);  // 추적할 URL 호출
      // } else {
      //   await handle(req, res, parsedUrl)
      // }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on <http://$>{hostname}:${port}`);
    });
});

# SuperAgent

SuperAgent는 기존의 복잡한 요청 API에 대한 불만에서 출발해 유연성, 가독성, 그리고 낮은 학습 난이도를 목표로 설계된 경량 Ajax API입니다. 또한 Node.js 환경에서도 동작합니다!

```javascript
request
  .post('/api/pet')
  .send({ name: 'Manny', species: 'cat' })
  .set('X-API-Key', 'foobar')
  .set('Accept', 'application/json')
  .then((res) => {
    alert('yay got ' + JSON.stringify(res.body));
  });
```

## 테스트 문서

[**English**](/superagent/)

다음의 [테스트 문서](../test.html)는 [Mocha](https://mochajs.org/)의 "doc" 리포터를 사용해 생성되었으며, 실제 테스트 스위트를 직접 반영합니다.  
이 문서는 추가적인 참고 자료로 활용할 수 있습니다.

## 기본 요청

요청은 `request` 객체에서 적절한 메서드를 호출하여 시작되며, 그 다음 `.then()` 또는 `.end()` 혹은 [`await`](#promise-and-generator-support)를 사용해 요청을 전송할 수 있습니다. 예를 들어, 간단한 **GET** 요청은 다음과 같습니다.

```javascript
request
  .get('/search')
  .then((res) => {
    // res.body, res.headers, res.status
  })
  .catch((err) => {
    // err.message, err.response
  });
```

HTTP 메서드는 문자열로도 전달할 수 있습니다.

```javascript
request('GET', '/search').then(success, failure);
```

예전 방식의 콜백도 지원되지만, 권장되지는 않습니다. `.then()` 대신 `.end()`를 호출하여 요청을 전송할 수 있습니다.

```javascript
request('GET', '/search').end(function (err, res) {
  if (res.ok) {
  }
});
```

절대 URL을 사용할 수 있습니다. 단, 웹 브라우저에서는 서버가 [CORS](#cors)를 구현한 경우에만 절대 URL이 정상적으로 작동합니다.

```javascript
request.get('https://example.com/search').then((res) => {});
```

**Node** 클라이언트는 [유닉스 도메인 소켓](https://ko.wikipedia.org/wiki/%EC%9C%A0%EB%8B%89%EC%8A%A4_%EB%8F%84%EB%A9%94%EC%9D%B8_%EC%86%8C%EC%BC%93)을 통한 요청을 지원합니다.

```javascript
// pattern: https?+unix://SOCKET_PATH/REQUEST_PATH
//          Use `%2F` as `/` in SOCKET_PATH
try {
  const res = await request.get(
    'http+unix://%2Fabsolute%2Fpath%2Fto%2Funix.sock/search'
  );
  // res.body, res.headers, res.status
} catch (err) {
  // err.message, err.response
}
```

**DELETE**, **HEAD**, **PATCH**, **POST**, **PUT** 요청도 사용할 수 있으며, 다음 예시에서 메서드 이름만 변경하면 됩니다.

```javascript
request.head('/favicon.ico').then((res) => {});
```

**DELETE**는 `delete`가 예약어였던 구형 IE와의 호환성을 위해 `.del()` 메서드로도 호출할 수 있습니다.

HTTP 메서드의 기본값은 **GET**이므로, 다음과 같이 작성해도 유효합니다.

```javascript
request('/search', (err, res) => {});
```

## HTTP/2 사용하기

HTTP/1.x 폴백 없이 HTTP/2 프로토콜만 사용하려면 `.http2()` 메서드를 호출하여 요청을 전송할 수 있습니다.

```javascript
const request = require('superagent');
const res = await request.get('https://example.com/h2').http2();
```

## 헤더 필드 설정하기

헤더 필드 설정은 간단합니다. 필드 이름과 값을 `.set()` 메서드에 전달하면 됩니다.

```javascript
request
  .get('/search')
  .set('API-Key', 'foobar')
  .set('Accept', 'application/json')
  .then(callback);
```

You may also pass an object to set several fields in a single call:

여러 개의 헤더 필드를 한 번에 설정하려면 객체를 전달하면 됩니다.

```javascript
request
  .get('/search')
  .set({ 'API-Key': 'foobar', Accept: 'application/json' })
  .then(callback);
```

## `GET` 요청

`.query()` 메서드는 객체를 인자로 받아 **GET** 요청 시 쿼리 문자열을 자동으로 생성합니다. 예를 들어 다음 코드는 `/search?query=Manny&range=1..5&order=desc` 경로를 생성합니다.

````js
request
  .get('/search')
  .query({ query: 'Manny', range: '1..5', order: 'desc' });


```javascript
request
  .get('/search')
  .query({ query: 'Manny' })
  .query({ range: '1..5' })
  .query({ order: 'desc' })
  .then((res) => {});
````

또는 하나의 객체로 설정할 수 있습니다.

```javascript
request
  .get('/search')
  .query({ query: 'Manny', range: '1..5', order: 'desc' })
  .then((res) => {});
```

`.query()` 메서드는 문자열도 받습니다.

```javascript
request
  .get('/querystring')
  .query('search=Manny&range=1..5')
  .then((res) => {});
```

조인할 수도 있습니다.

```javascript
request
  .get('/querystring')
  .query('search=Manny')
  .query('range=1..5')
  .then((res) => {});
```

## `HEAD` 요청하기

HEAD 요청에서도 `.query()` 메서드를 사용할 수 있습니다. 예를 들어 다음 코드는 `/users?email=joe@smith.com` 경로를 생성합니다.

```javascript
request
  .head('/users')
  .query({ email: 'joe@smith.com' })
  .then((res) => {});
```

## `POST` / `PUT` 요청

전형적인 JSON **POST** 요청은 Content-Type 헤더를 적절히 설정하고,  
데이터를 JSON 형식으로 전송하는 방식입니다. 예를 들어 다음과 같은 코드가 이에 해당합니다.

```javascript
request
  .post('/user')
  .set('Content-Type', 'application/json')
  .send('{"name":"tj","pet":"tobi"}')
  .then(callback)
  .catch(errorCallback);
```

JSON은 가장 일반적으로 사용되므로 기본값으로 설정되어 있습니다. 다음 예제는 앞선 예제와 동일한 동작을 수행합니다.

```javascript
request
  .post('/user')
  .send({ name: 'tj', pet: 'tobi' })
  .then(callback, errorCallback);
```

또는 `.send()` 여러 번 호출할 수 있습니다.

```javascript
request
  .post('/user')
  .send({ name: 'tj' })
  .send({ pet: 'tobi' })
  .then(callback, errorCallback);
```

기본적으로 문자열을 전송하면 `Content-Type`이 `application/x-www-form-urlencoded`로 자동 설정됩니다.  
여러 번 `.send()`를 호출하면 각 문자열이 `&`로 연결되어 최종적으로 `name=tj&pet=tobi`와 같은 결과가 생성됩니다.

```javascript
request
  .post('/user')
  .send('name=tj')
  .send('pet=tobi')
  .then(callback, errorCallback);
```

SuperAgent는 다양한 형식으로 확장 가능하지만, 기본적으로 "json"과 "form" 형식을 지원합니다. `application/x-www-form-urlencoded` 형식으로 데이터를 전송하려면 `.type('form')`을 호출하면 됩니다. 기본 형식은 `"json"`입니다. 다음 요청은 본문에 `"name=tj&pet=tobi"`를 포함하여 **POST**됩니다.

```javascript
request
  .post('/user')
  .type('form')
  .send({ name: 'tj' })
  .send({ pet: 'tobi' })
  .then(callback, errorCallback);
```

[`FormData`](https://developer.mozilla.org/ko/docs/Web/API/FormData/FormData) 객체를 사용하는 것도 지원됩니다. 다음 예제는 `id="myForm"`인 HTML 폼의 내용을 **POST** 방식으로 전송합니다.

```javascript
request
  .post('/user')
  .send(new FormData(document.getElementById('myForm')))
  .then(callback, errorCallback);
```

## `Content-Type` 설정하기

가장 명확한 해결책은 `.set()` 메서드를 사용하는 것입니다.

```javascript
request.post('/user').set('Content-Type', 'application/json');
```

간단하게 `.type()` 메서드를 사용할 수 있으며,  
표준화된 MIME 타입(`type/subtype`)을 직접 지정하거나  
"xml", "json", "png" 등과 같은 확장자 이름만으로도 설정할 수 있습니다.

```javascript
request.post('/user').type('application/json');

request.post('/user').type('json');

request.post('/user').type('png');
```

## 요청 본문 직렬화하기

SuperAgent는 기본적으로 JSON과 폼 데이터를 자동으로 직렬화합니다.  
또한 다른 콘텐츠 유형에 대해서도 자동 직렬화를 설정할 수 있습니다.

```js
request.serialize['application/xml'] = function (obj) {
  return 'string generated from obj';
};

// 'application/xml' Content-type을 가진 모든 요청은
// 자동으로 직렬화 됩니다.
```

사용자 정의 형식으로 페이로드를 전송하려면,  
요청 단위로 `.serialize()` 메서드를 사용해 SuperAgent의 기본 직렬화 방식을 교체할 수 있습니다.

```js
request
  .post('/user')
  .send({ foo: 'bar' })
  .serialize((obj) => {
    return 'string generated from obj';
  });
```

## 요청 재시도하기

`.retry()` 메서드를 사용하면, 일시적인 오류나 불안정한 인터넷 연결로 인해 요청이 실패한 경우 SuperAgent가 자동으로 재시도합니다.

이 메서드는 두 개의 선택적 인자를 받습니다. 재시도 횟수(기본값은 1)와 콜백 함수입니다. 각 재시도 전에 `callback(err, res)`를 호출합니다. 콜백 함수는 요청을 재시도할지 여부를 결정하기 위해 `true` 또는 `false`를 반환할 수 있습니다. 단, 최대 재시도 횟수는 항상 적용됩니다.

```javascript
     request
       .get('https://example.com/search')
       .retry(2) // 혹은
       .retry(2, callback)
       .then(finished);
       .catch(failed);
```

멱등한 요청인 경우에만 `.retry()` 메서드를 사용하세요. 예를 들어, 동일한 요청이 서버에 여러 번 도달하더라도 중복 구매와 같은 바람직하지 않은 부작용이 발생하지 않아야 합니다.

모든 요청 메서드는 기본적으로 재시도 대상에 포함됩니다. 따라서 POST 요청을 재시도하지 않도록 하려면, 사용자 정의 재시도 콜백을 전달해야 합니다.

기본적으로 다음과 같은 상태 코드는 자동으로 재시도됩니다.

- `408`
- `413`
- `429`
- `500`
- `502`
- `503`
- `504`
- `521`
- `522`
- `524`

기본적으로 다음과 같은 오류 코드가 자동으로 재시도됩니다.

- `'ETIMEDOUT'`
- `'ECONNRESET'`
- `'EADDRINUSE'`
- `'ECONNREFUSED'`
- `'EPIPE'`
- `'ENOTFOUND'`
- `'ENETUNREACH'`
- `'EAI_AGAIN'`

## Accept 설정하기

`.type()` 메서드와 유사하게, `.accept()` 메서드를 사용하면 `Accept` 헤더를 간편하게 설정할 수 있습니다. 이 메서드는 `request.types`를 참조하며, `type/subtype` 형식의 MIME 타입 전체 이름이나 "xml", "json", "png" 등의 확장자 형태로도 지정할 수 있어 편리합니다.

```javascript
request.get('/user').accept('application/json');

request.get('/user').accept('json');

request.post('/user').accept('png');
```

### Facebook과 Accept JSON

Facebook API를 호출할 때는 반드시 요청 헤더에 `Accept: application/json`을 포함해야 합니다. 그렇지 않으면 Facebook은 `Content-Type: text/javascript; charset=UTF-8`으로 응답하게 되며, SuperAgent는 이 형식을 파싱하지 못해 `res.body`가 `undefined`가 됩니다. `req.accept('json')` 또는 `req.set('Accept', 'application/json')`을 사용할 수 있습니다. 자세한 사항은 [issue 1078](https://github.com/ladjs/superagent/issues/1078)에서 확인해보세요.

## 쿼리 문자열

`req.query(obj)`는 쿼리 문자열을 구성하는 데 사용되는 메서드입니다. 예를 들어 **POST** 요청에서 `?format=json&dest=/login`과 같은 쿼리 문자열을 추가할 수 있습니다.

```javascript
request
  .post('/')
  .query({ format: 'json' })
  .query({ dest: '/login' })
  .send({ post: 'data', here: 'wahoo' })
  .then(callback);
```

기본적으로 쿼리 문자열은 특정한 순서로 조립되지 않습니다. ASCII 순으로 정렬된 쿼리 문자열을 사용하려면 `req.sortQuery()`를 호출하면 됩니다. 또한 `req.sortQuery(myComparisonFn)`을 통해 사용자 정의 정렬 비교 함수를 전달할 수도 있습니다. 비교 함수는 두 개의 인자를 받아 음수, 0 또는 양수를 반환해야 합니다.

```js
// 기본 정렬 방식
request
  .get('/user')
  .query('name=Nick')
  .query('search=Manny')
  .sortQuery()
  .then(callback);

// 사용자 정의 정렬 함수
request
  .get('/user')
  .query('name=Nick')
  .query('search=Manny')
  .sortQuery((a, b) => a.length - b.length)
  .then(callback);
```

## TLS 옵션

Node.js에서 SuperAgent는 HTTPS 요청을 구성할 수 있는 다양한 메서드를 지원합니다.

- `.ca()`: 신뢰할 CA 인증서를 설정합니다.
- `.cert()`: 클라이언트 인증서 체인을 설정합니다.
- `.key()`: 클라이언트의 개인 키를 설정합니다.
- `.pfx()`: PKCS12 형식의 PFX 파일을 사용하여 클라이언트의 개인 키와 인증서 체인을 설정합니다.
- `.disableTLSCerts()`: 만료되었거나 유효하지 않은 TLS 인증서를 거부하지 않도록 설정합니다. 내부적으로 `rejectUnauthorized=true`가 설정되며, 중간자 공격(MITM)에 노출될 수 있으므로 주의가 필요합니다.

더 자세한 내용은 Node.js [https.request 문서](https://nodejs.org/api/https.html#https_https_request_options_callback)에서 확인할 수 있습니다.

```js
var key = fs.readFileSync('key.pem'),
  cert = fs.readFileSync('cert.pem');

request.post('/client-auth').key(key).cert(cert).then(callback);
```

```js
var ca = fs.readFileSync('ca.cert.pem');

request
  .post('https://localhost/private-ca-server')
  .ca(ca)
  .then((res) => {});
```

## Parsing response bodies

## 응답 본문 파싱하기

SuperAgent will parse known response-body data for you,
currently supporting `application/x-www-form-urlencoded`,
`application/json`, and `multipart/form-data`. You can setup
automatic parsing for other response-body data as well:

SuperAgent는 응답 본문 데이터를 자동으로 파싱해줍니다.  
현재 `application/x-www-form-urlencoded`, `application/json`, `multipart/form-data`을 지원합니다. 이외의 응답 본문 데이터에 대해서도 자동 파싱을 설정할 수 있습니다.

```js
// 브라우저
request.parse['application/xml'] = function (str) {
  return { object: 'parsed from str' };
};

// node
request.parse['application/xml'] = function (res, cb) {
  // 응답 문자를 파싱하고 res.body를 여기서 설정하세요

  cb(null, res);
};

// 앞으로 'application/xml' 유형의 반응은
// 자동으로 파싱됩니다
```

`.buffer(true).parse(fn)` 메서드를 사용하면 내장된 파서보다 우선적으로 적용되는 사용자 정의 파서를 설정할 수 있습니다. `.buffer(false)`로 응답 버퍼링이 비활성화되어 있다면, `response` 이벤트는 본문 파싱이 완료되기 전에 발생하므로 `response.body`를 사용할 수 없습니다.

### JSON / Urlencoded

`res.body` 속성은 파싱된 객체를 나타냅니다. 예를 들어, 응답이 JSON 문자열 `{"user":{"name":"tobi"}}`를 반환했다면, `res.body.user.name`은 "tobi" 값을 갖게 됩니다. 마찬가지로 x-www-form-urlencoded 형식의 "user[name]=tobi"도 동일한 결과를 제공합니다. 단, 중첩은 한 단계까지만 지원되므로 더 복잡한 구조의 데이터를 다루려면 JSON 형식을 사용하는 것이 좋습니다.

배열은 key를 반복해서 전달하는 방식으로 전송됩니다. 예를 들어, `.send({ color: ['red', 'blue'] })`는 `color=red&color=blue`로 변환되어 전송됩니다. 배열의 key에 `[]`를 포함시키고 싶다면 SuperAgent는 이를 자동으로 처리하지 않으므로, 직접 `color[]`와 같이 key 이름에 대괄호를 추가해야 합니다.

### 다중 파트

Node 클라이언트는 [Formidable](https://github.com/felixge/node-formidable) 모듈을 통해 *multipart/form-data*를 지원합니다.  
다중 파트 응답을 파싱할 때 `res.files` 객체를 사용할 수 있으며, 이 객체에는 업로드된 파일에 대한 정보가 포함됩니다. 예를 들어, 다음과 같은 multipart 본문을 포함한 응답을 가정해볼 수 있습니다.

    --whoop
    Content-Disposition: attachment; name="image"; filename="tobi.png"
    Content-Type: image/png

    ... data here ...
    --whoop
    Content-Disposition: form-data; name="name"
    Content-Type: text/plain

    Tobi
    --whoop--

`res.body.name`은 "Tobi" 값을 가지고 있으며, `res.files.image`는 디스크 경로, 파일 이름 및 기타 속성을 포함한 `File` 객체입니다.

### 바이너리

브라우저에서는 바이너리 응답 본문을 처리하기 위해 `.responseType('blob')`을 사용할 수 있습니다. 이 API는 Node.js 환경에서는 필요하지 않습니다. 이 메서드에서 지원되는 인자 값은 다음과 같습니다.

- `'blob'`는 XMLHttpRequest의 `responseType` 속성에 그대로 전달됩니다.
- `'arraybuffer'`도 마찬가지로 `responseType` 속성에 전달됩니다.

```js
req
  .get('/binary.data')
  .responseType('blob')
  .then((res) => {
    // 여기서 res.body는 브라우저 기본 Blob 타입입니다.
  });
```

더 자세한 내용은 Mozilla Developer Network의 [XMLHttpRequest.responseType 문서](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)에서 확인할 수 있습니다.

## 응답 속성

`Response` 객체에는 응답 텍스트, 파싱된 응답 본문, 헤더 필드, 상태 플래그 등 다양한 유용한 플래그와 속성이 설정되어 있습니다.

### 응답 문자

`res.text` 속성에는 파싱되지 않은 응답 본문 문자열이 포함됩니다. 이 속성은 클라이언트 API에서는 항상 존재하며, Node 환경에서는 MIME 타입이 "text/_", "_/json", "x-www-form-urlencoded"와 일치할 경우에만 기본적으로 제공됩니다. 이러한 제한은 대용량 multipart 파일이나 이미지 등의 본문을 텍스트로 버퍼링하는 것이 매우 비효율적이기 때문에 메모리를 절약하기 위한 목적입니다. 응답을 강제로 버퍼링하려면 "응답 버퍼링" 섹션을 참조하세요.

### 응답 본문

SuperAgent는 요청 데이터를 자동으로 직렬화할 뿐만 아니라, 자동으로 파싱할 수도 있습니다. Content-Type에 대해 파서가 정의되어 있는 경우, 해당 타입에 맞게 응답이 파싱되며 기본적으로 "application/json"과 "application/x-www-form-urlencoded" 형식이 포함됩니다. 파싱된 객체는 `res.body`를 통해 접근할 수 있습니다.

### 응답 헤더 필드

`res.header`는 파싱된 응답 헤더 필드를 담은 객체로, Node.js와 마찬가지로 필드 이름을 소문자로 변환하여 저장합니다.  
예를 들어, `res.header['content-length']`와 같이 접근할 수 있습니다.

### 응답 콘텐츠 타입

Content-Type 응답 헤더는 특별하게 처리되어 `res.type` 속성은 charset 정보를 제외한 콘텐츠 타입만을 제공합니다. 예를 들어 Content-Type이 "text/html; charset=utf8"인 경우, `res.type`은 "text/html"을 반환하고, `res.charset` 속성에는 "utf8"이 포함됩니다.

### 응답 상태

응답 상태 플래그는 요청이 성공했는지 여부를 비롯한 다양한 유용한 정보를 판단하는 데 도움을 줍니다. 이를 통해 SuperAgent는 RESTful 웹 서비스와 효과적으로 상호작용할 수 있습니다. 현재 정의된 주요 플래그는 다음과 같습니다.

```javascript
var type = (status / 100) | 0;

// 상태 / 클래스
res.status = status;
res.statusType = type;

// 기본
res.info = 1 == type;
res.ok = 2 == type;
res.clientError = 4 == type;
res.serverError = 5 == type;
res.error = 4 == type || 5 == type;

// 편의 기능
res.accepted = 202 == status;
res.noContent = 204 == status || 1223 == status;
res.badRequest = 400 == status;
res.unauthorized = 401 == status;
res.notAcceptable = 406 == status;
res.notFound = 404 == status;
res.forbidden = 403 == status;
```

## 요청 중단하기

요청을 중단하려면 `req.abort()` 메서드를 호출하기만 하면 됩니다.

## 타임아웃

때때로 네트워크나 서버가 요청을 수신한 후 응답 없이 멈춰버리는 경우가 있습니다. 이러한 무한 대기를 방지하려면 타임아웃을 설정해야 합니다.

- `req.timeout({deadline: ms})` 또는 `req.timeout(ms)`는 업로드, 리다이렉트, 서버 처리 시간을 포함한 전체 요청이 완료되어야 하는 최종 시간 제한을 설정합니다. `ms`는 0보다 큰 밀리초 단위의 숫자이며, 제한 시간 내에 응답이 완료되지 않으면 요청은 중단됩니다.

- `req.timeout({response: ms})`는 서버로부터 첫 번째 바이트가 도착할 때까지의 최대 대기 시간을 설정합니다. 전체 다운로드 소요 시간은 제한하지 않습니다. 응답 타임아웃은 DNS 조회, TCP/IP 및 TLS 연결, 요청 데이터 업로드 시간을 포함하므로, 서버의 실제 응답 시간보다 몇 초 더 길게 설정하는 것이 좋습니다.

`deadline`과 `response` 타임아웃은 함께 사용하는 것이 좋습니다. 짧은 응답 타임아웃은 응답하지 않는 네트워크를 빠르게 감지하는 데 유용하고, 긴 데드라인은 느리지만 안정적인 네트워크 환경에서 다운로드를 완료할 수 있도록 여유 시간을 제공합니다. 두 타이머 모두 첨부된 파일 업로드에 허용되는 시간을 제한합니다. 파일을 업로드하는 경우에는 충분히 긴 타임아웃을 설정하는 것이 좋습니다.

```javascript
request
  .get('/big-file?network=slow')
  .timeout({
    response: 5000, // 서버가 데이터를 보내기 시작할 때까지 최대 5초간 기다립니다.
    deadline: 60000 // 파일 전체를 로드하는 데 최대 1분까지 허용합니다.
  })
  .then(
    (res) => {
      /* 제시간 응답 수신 */
    },
    (err) => {
      if (err.timeout) {
        /* 시간 초과! */
      } else {
        /* 그 외 오류 */
      }
    }
  );
```

타임아웃 오류에는 `.timeout` 속성이 포함되어 있습니다.

## 인증

Node와 브라우저 환경에서 `.auth()` 메서드를 사용하여 인증을 수행할 수 있습니다.

```javascript
request.get('http://local').auth('tobi', 'learnboost').then(callback);
```

_Node_ 클라이언트에서는 기본 인증을 URL 내에 "user:pass" 형식으로 포함시킬 수 있습니다.

```javascript
request.get('http://tobi:learnboost@local').then(callback);
```

기본적으로 `Basic` 인증만 사용됩니다. 브라우저에서는 `{type: 'auto'}`를 추가하면 Digest, NTLM 등 브라우저에 내장된 모든 인증 방식을 사용할 수 있습니다.

```javascript
request.auth('digest', 'secret', { type: 'auto' });
```

`auth` 메서드는 토큰 기반 인증을 위한 `type: 'bearer'` 옵션도 지원합니다.

```javascript
request.auth('my_token', { type: 'bearer' });
```

## 다음 리다이렉션 따라가기

기본적으로 최대 5번까지 리다이렉션이 자동으로 따라가며, 필요에 따라 `res.redirects(n)` 메서드를 사용하여 이 횟수를 지정할 수 있습니다.

```javascript
const response = await request.get('/some.png').redirects(2);
```

리다이렉션 횟수가 제한을 초과하면 오류로 간주됩니다. 이를 성공적인 응답으로 처리하려면 `.ok(res => res.status < 400)` 메서드를 사용하세요.

## 전역 상태를 위한 에이전트

### 쿠키 저장하기

Node에서 SuperAgent는 기본적으로 쿠키를 저장하지 않습니다. 하지만 `.agent()` 메서드를 사용하면 쿠키를 저장하는 SuperAgent 인스턴스를 생성할 수 있습니다. 각 인스턴스는 독립적인 쿠키 저장소를 가지고 있습니다.

```javascript
const agent = request.agent();
agent.post('/login').then(() => {
  return agent.get('/cookied-page');
});
```

브라우저에서는 쿠키가 자동으로 관리되므로 `.agent()`를 사용해도 쿠키가 분리되지는 않습니다.

### 다중 요청을 위한 기본 옵션

에이전트에서 호출된 일반 요청 메서드는 해당 에이전트가 처리하는 모든 요청에 대해 기본값으로 적용됩니다.

```javascript
const agent = request.agent().use(plugin).auth(shared);

await agent.get('/with-plugin-and-auth');
await agent.get('/also-with-plugin-and-auth');
```

에이전트가 기본 옵션을 설정할 수 있도록 지원하는 메서드 목록입니다. `use`, `on`, `once`, `set`, `query`, `type`, `accept`, `auth`, `withCredentials`, `sortQuery`, `retry`, `ok`, `redirects`, `timeout`, `buffer`, `serialize`, `parse`, `ca`, `key`, `pfx`, `cert`.

## 데이터 전달 방식

`.pipe()`는 `.end()` 또는 `.then()` 메서드 **대신** 사용되며, Node 클라이언트는 요청과 응답 간에 데이터를 주고받도록 파이프 처리할 수 있습니다.

예를 들어, 파일의 콘텐츠를 요청 본문으로 전달하는 경우는 다음과 같습니다.

```javascript
const request = require('superagent');
const fs = require('fs');

const stream = fs.createReadStream('path/to/my.json');
const req = request.post('/somewhere');
req.type('json');
stream.pipe(req);
```

요청에 데이터를 파이프할 경우, SuperAgent는 해당 데이터를 [청크 전송 인코딩](https://en.wikipedia.org/wiki/Chunked_transfer_encoding) 방식으로 전송합니다. 이 방식은 Python WSGI 서버 등 모든 서버에서 지원되지는 않습니다.

응답을 파일로 저장하려면 다음과 같이 파이프 처리할 수 있습니다.

```javascript
const stream = fs.createWriteStream('path/to/my.json');
const req = request.get('/some.json');
req.pipe(stream);
```

파이프와 콜백 또는 프로미스는 **함께 사용할 수 없으며**, `.end()`나 `Response` 객체의 결과를 파이프 처리해서는 안 됩니다.

```javascript
// 이러한 방식으로 하지 마세요.
const stream = getAWritableStream();
const req = request
  .get('/some.json')
  // 나쁨: 이 방식은 스트림에 올바르지 않은 데이터를 전달하며 예기치 못한 방식으로 실패할 수 있습니다.
  .end((err, this_does_not_work) => this_does_not_work.pipe(stream));
const req = request
  .get('/some.json')
  .end()
  // 나쁨: 이 방식도 지원되지 않으며, .pipe는 자동으로 .end를 호출합니다.
  .pipe(nope_its_too_late);
```

SuperAgent의 [향후 버전](https://github.com/ladjs/superagent/issues/1188)에서는 `pipe()`를 부적절하게 호출하면 실패하게 됩니다.

## 다중 부분 요청

`.attach()`와 `.field()` 메서드를 제공하는 SuperAgent는 다중 부분 요청을 구성하는 데에도 매우 유용합니다.

`.field()` 또는 `.attach()`를 사용할 경우 `.send()`는 사용할 수 없으며, `Content-Type` 헤더를 직접 설정해서는 안 됩니다. 올바른 타입은 자동으로 지정됩니다.

### 파일 첨부하기

`.attach(name, [file], [options])`를 사용하여 파일을 전송할 수 있습니다. 여러 파일을 첨부하려면 `.attach`를 반복 호출하면 됩니다. 인자는 다음과 같습니다.

- `name` — 폼 이름 필드
- `file` — 파일 경로의 문자열 또는 `Blob`/`Buffer` 객체.
- `options` — (선택) 사용자 정의 파일 이름의 문자열 또는 `{filename: string}` 형식의 객체. Node 환경에서는 `{contentType: 'mime/type'}`도 지원하며 브라우저에서는 적절한 타입의 `Blob` 객체를 생성해야 합니다.

<br>

```javascript
request
  .post('/upload')
  .attach('image1', 'path/to/felix.jpeg')
  .attach('image2', imageBuffer, 'luna.jpeg')
  .field('caption', 'My cats')
  .then(callback);
```

### 필드 값

`.field(name, value)` 및 `.field({name: value})`를 사용해 HTML 폼 필드처럼 값을 설정할 수 있습니다. 예를 들어 이름과 이메일 정보를 함께 여러 이미지를 업로드하려면, 요청은 다음과 같이 구성될 수 있습니다.

```javascript
request
  .post('/upload')
  .field('user[name]', 'Tobi')
  .field('user[email]', 'tobi@learnboost.com')
  .field('friends[]', ['loki', 'jane'])
  .attach('image', 'path/to/tobi.png')
  .then(callback);
```

## 압축

node 클라이언트는 압축된 응답을 지원하며, 아무 것도 하지 않아도 됩니다! 그냥 작동합니다.

## 응답 버퍼링

To force buffering of response bodies as `res.text` you may invoke `req.buffer()`. To undo the default of buffering for text responses such as "text/plain", "text/html" etc you may invoke `req.buffer(false)`.

`.req.buffer()`를 호출하면 응답 본문을 `res.text`로 강제 버퍼링할 수 있습니다. "text/plain", "text/html" 등 텍스트 응답의 기본 버퍼링을 취소하려면 `.req.buffer(false)`를 호출하세요.

`res.buffered` 플래그가 제공되면, 이를 활용하여 동일한 콜백 함수에서 버퍼링된 응답과 버퍼링되지 않은 응답을 모두 처리할 수 있습니다.

## CORS

보안상의 이유로 브라우저는 서버가 CORS 헤더를 통해 명시적으로 허용하지 않으면 교차 출처 요청(cross-origin requests)을 차단합니다. 브라우저는 또한 서버가 어떤 HTTP 헤더와 메서드를 허용하는지 확인하기 위해 추가적인 **OPTIONS** 요청을 전송합니다. [CORS에 대해 더 알아보기](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS).

`.withCredentials()` 메서드는 origin(출처)에서 쿠키를 전송할 수 있도록 활성화합니다. 단, 이 기능은 `Access-Control-Allow-Origin` 값이 와일드카드("\*")가 _아니어야_ 하며, `Access-Control-Allow-Credentials` 값이 `"true"`일 경우에만 작동합니다.

```javascript
request
  .get('https://api.example.com:4001/')
  .withCredentials()
  .then((res) => {
    assert.equal(200, res.status);
    assert.equal('tobi', res.text);
  });
```

## 오류 처리하기

콜백 함수는 항상 두 개의 인자를 전달합니다. 오류와 응답입니다. 오류가 발생하지 않으면, 첫 번째 인자는 null 입니다.

```javascript
request
  .post('/upload')
  .attach('image', 'path/to/tobi.png')
  .then((res) => {});
```

"error" 이벤트도 발생하며, 이를 통해 오류를 감지하고 처리할 수 있습니다.

```javascript
request
  .post('/upload')
  .attach('image', 'path/to/tobi.png')
  .on('error', handle)
  .then((res) => {});
```

**SuperAgent는 기본적으로 4xx 및 5xx 응답(그리고 처리되지 않은 3xx 응답도 포함)을 오류**로 간주합니다. 예를 들어 `304 Not Modified`, `403 Forbidden`, `500 Internal Server Error` 같은 응답을 받으면 해당 상태 정보는 `err.status`를 통해 확인할 수 있습니다. 이러한 응답으로부터 발생한 오류에는 "[응답 요소](#response-properties)"에서 언급한 모든 속성을 포함한 `err.response` 필드도 포함됩니다. 이 라이브러리는 일반적으로 성공 응답만을 원하고, HTTP 오류 상태 코드를 오류로 처리하는 경우를 대비하여 이러한 방식으로 동작합니다. 하지만 특정 오류 조건에 대해서는 사용자 정의 로직을 허용하도록 설계되어 있습니다.

네트워크 실패, 시간초과, 응답 없는 오류는 `err.status` 또는 `err.response` 필드를 포함하지 않습니다.

404 또는 HTTP 오류 응답을 처리하고 싶다면, `error.status` 요소를 사용할 수 있습니다. HTTP 오류(4xx 또는 5xx 응답)가 발생했을 때 `res.error` 요소는 `Error` 객체이고 이는 다음과 같이 에러 확인을 수행할 수 있습니다.

```javascript
if (err && err.status === 404) {
  alert('oh no ' + res.body.message);
} else if (err) {
  // 그 외 다른 모든 오류 유형은 일반적으로 처리합니다
}
```

대안으로, `.ok(callback)` 메서드를 사용하여 응답이 오류인지 아닌지 결정할 수 있습니다. `ok` 콜백은 응답을 받고 응답이 성공으로 해석되면 `true`를 반환합니다.

```javascript
request
  .get('/404')
  .ok((res) => res.status < 500)
  .then((response) => {
    // 404 페이지를 성공적인 응답으로 처리합니다
  });
```

## 진행과정 추적하기

SuperAgent는 업로드와 큰 파일 다운로드에서 `progress` 이벤트를 동작시킵니다.

```javascript
request
  .post(url)
  .attach('field_name', file)
  .on('progress', (event) => {
    /* 이벤트 객체는 다음과 같습니다.
        {
          direction: "upload" or "download"
          percent: 0 to 100 // 0에서 100까지 (파일 크기를 알 수 없는 경우 생략될 수 있습니다)
          total: // 전체 파일 크기 (생략될 수 있습니다)
          loaded: // 현재까지 다운로드되거나 업로드된 바이트 수
        } */
  })
  .then();
```

## 로컬 호스트에서 테스트하기

### 특정 IP 주소 연결 설정하기

In Node.js it's possible to ignore DNS resolution and direct all requests to a specific IP address using `.connect()` method. For example, this request will go to localhost instead of `example.com`:

Node.js에서는 DNS를 무시하고 `.connect()` 메서드를 사용하여 모든 요청을 특정 IP 주소로 직접 연결할 수 있습니다. 예를 들어, 이 요청은 `example.com` 대신 로컬호스트로 전달됩니다.

```javascript
const res = await request.get('http://example.com').connect('127.0.0.1');
```

요청은 리다이렉트 되어, 여러 호스트명과 IP를 특정지을 수 있으며 특별한 `*`를 대체로 설정할 수 있습니다. (다른 와일드 카드는 지원되지 않습니다). 요청은 원본 값을 가지며 본인의 `Host` 헤더를 유지합니다. `.connect(undefined)`는 이러한 기능을 끕니다.

```javascript
const res = await request.get('http://redir.example.com:555').connect({
  'redir.example.com': '127.0.0.1', // redir.example.com:555는 127.0.0.1:555를 사용합니다.
  'www.example.com': false, // 이 항목은 재정의하지 마세요. 일반적인 DNS 설정을 사용합니다.
  'mapped.example.com': { host: '127.0.0.1', port: 8080 }, // mapped.example.com의 모든 포트는 127.0.0.1:8080으로 매핑됩니다.
  '*': 'proxy.example.com' // 나머지 모든 요청은 이 호스트로 전달됩니다
});
```

### 로컬 호스트에서 깨지거나 보안되지 않은 HTTPS 무시하기

Node.js에서 HTTPS 설정이 잘못되었거나 보안성이 떨어지는 경우(예: 자체 서명된 인증서를 사용하면서 `.ca()`를 지정하지 않은 경우), `.trustLocalhost()`를 호출하면 `localhost`로의 요청을 허용할 수 있습니다.

```javascript
const res = await request.get('https://localhost').trustLocalhost();
```

`.connect("127.0.0.1")`와 함께 사용하면 HTTPS 요청을 어떤 도메인에서든 `localhost`로 강제로 리다이렉트할 수 있습니다.

`localhost`는 신뢰되지 않은 네트워크에 노출되지 않는 루프백 인터페이스이기 때문에, 깨진 HTTPS를 무시하는 것이 일반적으로 안전합니다. `localhost`를 신뢰하도록 설정하는 것이 향후 기본값이 될 수 있습니다. `127.0.0.1`의 진위 여부를 강제로 검사하려면 `.trustLocalhost(false)`를 사용하세요.

다른 IP 주소로 요청을 보낼 때 HTTPS 보안을 비활성화하는 기능은 의도적으로 지원하지 않습니다. 이러한 옵션은 HTTPS 문제를 빠르게 "해결"하려는 방식으로 오용되는 경우가 많기 때문입니다. [Let's Encrypt](https://certbot.eff.org)를 통해 무료 HTTPS 인증서를 발급받거나, `.ca(ca_public_pem)`을 사용해 자체 서명된 인증서를 신뢰할 수 있도록 직접 CA를 설정할 수 있습니다.

## Promise 및 Generator 지원

SuperAgent의 요청은 "thenable" 객체이며, JavaScript의 Promise 및 `async`/`await` 문법과 호환됩니다.

```javascript
const res = await request.get(url);
```

Promise를 사용할 경우, **`.end()` 또는 `.pipe()`를 호출하지 마세요**. `.then()` 또는 `await`를 사용하면 요청을 처리할 수 있는 다른 방식들이 모두 비활성화됩니다.

[co](https://github.com/tj/co)와 같은 라이브러리나 [koa](https://github.com/koajs/koa)와 같은 웹 프레임워크에서는 SuperAgent의 모든 메서드에서 `yield`를 사용할 수 있습니다.

```javascript
    const req = request
      .get('http://local')
      .auth('tobi', 'learnboost');
    const res = yield req;
```

SuperAgent는 전역 `Promise` 객체가 존재하는 환경에서 동작하도록 설계되어 있습니다. Internet Explorer나 Node.js 0.10에서 promise를 사용하려면 v7 버전과 폴리필이 필요합니다.

v8 버전부터는 IE에 대한 지원이 중단되었습니다. Opera 85나 iOS Safari 12.2–12.5 등을 지원하려면 WeakRef와 BigInt에 대한 폴리필을 추가해야 합니다. 예를 들어 <https://cdnjs.cloudflare.com/polyfill/>을 사용할 수 있습니다.

```html
<script src="https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=WeakRef,BigInt"></script>
```

## 브라우저와 node 버전

SuperAgent에는 두 가지 구현 방식이 있습니다. 하나는 웹 브라우저용(XHR 사용)이고, 다른 하나는 Node.JS용(core http 모듈 사용)입니다. 기본적으로 Browserify와 WebPack은 브라우저 버전을 선택합니다.

Node.JS용 코드를 컴파일하려면 WebPack 설정에서 반드시 [node target](https://webpack.github.io/docs/configuration.html#target)을 지정해야 합니다.

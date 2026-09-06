# superagent

[![build status](https://github.com/forwardemail/superagent/actions/workflows/ci.yml/badge.svg)](https://github.com/forwardemail/superagent/actions/workflows/ci.yml)
[![code coverage](https://img.shields.io/codecov/c/github/ladjs/superagent.svg)](https://codecov.io/gh/ladjs/superagent)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/ladjs/superagent.svg)](LICENSE)

> Small progressive client-side HTTP request library, and Node.js module with the same API, supporting many high-level HTTP client features.  Maintained for [Forward Email](https://github.com/forwardemail) and [Lad](https://github.com/ladjs).


## Table of Contents

* [Install](#install)
* [Usage](#usage)
  * [Node](#node)
  * [Browser](#browser)
* [Supported Platforms](#supported-platforms)
  * [Required Browser Features](#required-browser-features)
* [Plugins](#plugins)
* [Upgrading from previous versions](#upgrading-from-previous-versions)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install superagent
```

[yarn][]:

```sh
yarn add superagent
```


## Usage

### Node

```js
const superagent = require('superagent');

// callback
superagent
  .post('/api/pet')
  .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
  .set('X-API-Key', 'foobar')
  .set('accept', 'json')
  .end((err, res) => {
    // Calling the end function will send the request
  });

// promise with then/catch
superagent.post('/api/pet').then(console.log).catch(console.error);

// promise with async/await
(async () => {
  try {
    const res = await superagent.post('/api/pet');
    console.log(res);
  } catch (err) {
    console.error(err);
  }
})();
```

### Browser

**The browser-ready, minified version of `superagent` is only 50 KB (minified and gzipped).**

Browser-ready versions of this module are available via [jsdelivr][], [unpkg][], and also in the `node_modules/superagent/dist` folder in downloads of the `superagent` package.

> Note that we also provide unminified versions with `.js` instead of `.min.js` file extensions.

#### VanillaJS

This is the solution for you if you're just using `<script>` tags everywhere!

```html
<script src="https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=WeakRef,BigInt"></script>
<script src="https://cdn.jsdelivr.net/npm/superagent"></script>
<!-- if you wish to use unpkg.com instead: -->
<!-- <script src="https://unpkg.com/superagent"></script> -->
<script type="text/javascript">
  (function() {
    // superagent is exposed as `window.superagent`
    // if you wish to use "request" instead please
    // uncomment the following line of code:
    // `window.request = superagent;`
    superagent
      .post('/api/pet')
      .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
      .set('X-API-Key', 'foobar')
      .set('accept', 'json')
      .end(function (err, res) {
        // Calling the end function will send the request
      });
  })();
</script>
```

#### Bundler

If you are using [browserify][], [webpack][], [rollup][], or another bundler, then you can follow the same usage as [Node](#node) above.


## Supported Platforms

* Node: v14.18.0+
* Browsers (see [.browserslistrc](.browserslistrc)):

  ```sh
  npx browserslist
  ```

  ```sh
  and_chr 102
  and_ff 101
  and_qq 10.4
  and_uc 12.12
  android 101
  chrome 103
  chrome 102
  chrome 101
  chrome 100
  edge 103
  edge 102
  edge 101
  firefox 101
  firefox 100
  firefox 91
  ios_saf 15.5
  ios_saf 15.4
  ios_saf 15.2-15.3
  ios_saf 15.0-15.1
  ios_saf 14.5-14.8
  ios_saf 14.0-14.4
  ios_saf 12.2-12.5
  kaios 2.5
  op_mini all
  op_mob 64
  opera 86
  opera 85
  safari 15.5
  safari 15.4
  samsung 17.0
  samsung 16.0
  ```

### Required Browser Features

We recommend using <https://cdnjs.cloudflare.com/polyfill/> (specifically with the bundle mentioned in [VanillaJS](#vanillajs) above):

```html
<script src="https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=WeakRef,BigInt"></script>
```

* WeakRef is not supported in Opera 85, iOS Safari 12.2-12.5
* BigInt is not supported in iOS Safari 12.2-12.5


## Plugins

SuperAgent is easily extended via plugins.

```js
const nocache = require('superagent-no-cache');
const superagent = require('superagent');
const prefix = require('superagent-prefix')('/static');

superagent
  .get('/some-url')
  .query({ action: 'edit', city: 'London' }) // query string
  .use(prefix) // Prefixes *only* this request
  .use(nocache) // Prevents caching of *only* this request
  .end((err, res) => {
    // Do something
  });
```

Existing plugins:

* [superagent-no-cache](https://github.com/johntron/superagent-no-cache) - prevents caching by including Cache-Control header
* [superagent-prefix](https://github.com/johntron/superagent-prefix) - prefixes absolute URLs (useful in test environment)
* [superagent-suffix](https://github.com/timneutkens1/superagent-suffix) - suffix URLs with a given path
* [superagent-mock](https://github.com/M6Web/superagent-mock) - simulate HTTP calls by returning data fixtures based on the requested URL
* [superagent-mocker](https://github.com/shuvalov-anton/superagent-mocker) — simulate REST API
* [superagent-cache](https://github.com/jpodwys/superagent-cache) - A global SuperAgent patch with built-in, flexible caching
* [superagent-cache-plugin](https://github.com/jpodwys/superagent-cache-plugin) - A SuperAgent plugin with built-in, flexible caching
* [superagent-jsonapify](https://github.com/alex94puchades/superagent-jsonapify) - A lightweight [json-api](http://jsonapi.org/format/) client addon for superagent
* [superagent-serializer](https://github.com/zzarcon/superagent-serializer) - Converts server payload into different cases
* [superagent-httpbackend](https://www.npmjs.com/package/superagent-httpbackend) - stub out requests using AngularJS' $httpBackend syntax
* [superagent-throttle](https://github.com/leviwheatcroft/superagent-throttle) - queues and intelligently throttles requests
* [superagent-charset](https://github.com/magicdawn/superagent-charset) - add charset support for node's SuperAgent
* [superagent-verbose-errors](https://github.com/jcoreio/superagent-verbose-errors) - include response body in error messages for failed requests
* [superagent-declare](https://github.com/damoclark/superagent-declare) - A simple [declarative](https://en.wikipedia.org/wiki/Declarative_programming) API for SuperAgent
* [superagent-node-http-timings](https://github.com/webuniverseio/superagent-node-http-timings) - measure http timings in node.js
* [superagent-cheerio](https://github.com/mmmmmrob/superagent-cheerio) - add [cheerio](https://www.npmjs.com/package/cheerio) to your response content automatically. Adds `res.$` for HTML and XML response bodies.
* [@certible/superagent-aws-sign](https://github.com/certible/superagent-aws-sign) - Sign AWS endpoint requests, it uses the aws4 to authenticate the SuperAgent requests

Please prefix your plugin with `superagent-*` so that it can easily be found by others.

For SuperAgent extensions such as couchdb and oauth visit the [wiki](https://github.com/ladjs/superagent/wiki).


## Upgrading from previous versions

Please see [GitHub releases page](https://github.com/ladjs/superagent/releases) for the current changelog.

Our breaking changes are mostly in rarely used functionality and from stricter error handling.

* [6.0 to 6.1](https://github.com/ladjs/superagent/releases/tag/v6.1.0)
  * Browser behaviour changed to match Node when serializing `application/x-www-form-urlencoded`, using `arrayFormat: 'indices'` semantics of `qs` library. (See: <https://www.npmjs.com/package/qs#stringifying>)
* [5.x to 6.x](https://github.com/ladjs/superagent/releases/tag/v6.0.0):
  * Retry behavior is still opt-in, however we now have a more fine-grained list of status codes and error codes that we retry against (see updated docs)
  * A specific issue with Content-Type matching not being case-insensitive is fixed
  * Set is now required for IE 9, see [Required Browser Features](#required-browser-features) for more insight
* [4.x to 5.x](https://github.com/ladjs/superagent/releases/tag/v5.0.0):
  * We've implemented the build setup of [Lass](https://lass.js.org) to simplify our stack and linting
  * Unminified browserified build size has been reduced from 48KB to 20KB (via `tinyify` and the latest version of Babel using `@babel/preset-env` and `.browserslistrc`)
  * Linting support has been added using `caniuse-lite` and `eslint-plugin-compat`
  * We can now target what versions of Node we wish to support more easily using `.babelrc`
* [3.x to 4.x](https://github.com/ladjs/superagent/releases/tag/v4.0.0-alpha.1):
  * Ensure you're running Node 6 or later. We've dropped support for Node 4.
  * We've started using ES6 and for compatibility with Internet Explorer you may need to use Babel.
  * We suggest migrating from `.end()` callbacks to `.then()` or `await`.
* [2.x to 3.x](https://github.com/ladjs/superagent/releases/tag/v3.0.0):
  * Ensure you're running Node 4 or later. We've dropped support for Node 0.x.
  * Test code that calls `.send()` multiple times. Invalid calls to `.send()` will now throw instead of sending garbage.
* [1.x to 2.x](https://github.com/ladjs/superagent/releases/tag/v2.0.0):
  * If you use `.parse()` in the *browser* version, rename it to `.serialize()`.
  * If you rely on `undefined` in query-string values being sent literally as the text "undefined", switch to checking for missing value instead. `?key=undefined` is now `?key` (without a value).
  * If you use `.then()` in Internet Explorer, ensure that you have a polyfill that adds a global `Promise` object.
* 0.x to 1.x:
  * Instead of 1-argument callback `.end(function(res){})` use `.then(res => {})`.


## Contributors

| Name                |
| ------------------- |
| **Kornel Lesiński** |
| **Peter Lyons**     |
| **Hunter Loftis**   |
| **Nick Baugh**      |


## License

[MIT](LICENSE) © TJ Holowaychuk


##

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[jsdelivr]: https://www.jsdelivr.com/

[unpkg]: https://unpkg.com/

[browserify]: https://github.com/browserify/browserify

[webpack]: https://github.com/webpack/webpack

[rollup]: https://github.com/rollup/rollup


## 🌐 Web Resources & Interactive Index
- [STICKMAN ESCAPES FROM PRISON](https://quizverses.pages.dev/stickman-escapes-from-prison.html)
- [THE WALKING DEADBLOCKS](https://themindplays.pages.dev/the-walking-deadblocks.html)
- [ABOUT A FROG](https://iskillquest.pages.dev/about-a-frog.html)
- [CATEGORY RPG80](https://iskillquest.pages.dev/category-rpg80.html)
- [CRASH THE ROBOT](https://quizverses-9d2f2.web.app/crash-the-robot.html)
- [SHIP FACTORY TYCOON](https://quizverses-9d2f2.web.app/ship-factory-tycoon.html)
- [MOB RUSH](https://quizverses.github.io/mob-rush.html)
- [CATEGORY POOL 2](https://quizverses.pages.dev/category-pool-2.html)
- [FISH RAIN 2](https://quizverses-9d2f2.web.app/fish-rain-2.html)
- [HIGHWAY BUS RUSH](https://themindzone.pages.dev/highway-bus-rush.html)
- [CONTACT](https://quizverses.github.io/contact.html)
- [HORROR MINECRAFT PARTYTIME](https://themindzone.pages.dev/horror-minecraft-partytime.html)
- [ZOMBIE EEASTER BUNNIES](https://quizverses-9d2f2.web.app/zombie-eeaster-bunnies.html)
- [DINOSAUR CARDS](https://quizverses.github.io/dinosaur-cards.html)
- [PUSH TO GO](https://quizverses-9d2f2.web.app/push-to-go.html)
- [ROBOT RUNNER FIGHT](https://studyplaying.github.io/robot-runner-fight.html)
- [SNOWBOARD GAME PARTY](https://theskillquest.pages.dev/snowboard-game-party.html)
- [CATEGORY BASKETBALL 3](https://theskillquest.pages.dev/category-basketball-3.html)
- [CATEGORY TOP DOWN251](https://themindplay.pages.dev/category-top-down251.html)
- [SLIME FARM](https://quizverses-9d2f2.web.app/slime-farm.html)
- [CROWD EVOLUTION](https://learnquester.pages.dev/crowd-evolution.html)
- [ULTIMATE TOWER DEFENSE](https://themindzone.pages.dev/ultimate-tower-defense.html)
- [SLAP AND RUN](https://iskillquest.pages.dev/slap-and-run.html)
- [JELLY MATH 3D](https://studyquests.github.io/jelly-math-3d.html)
- [GT CHAMPIONSHIP ARCADE](https://themindzone.pages.dev/gt-championship-arcade.html)
- [CATEGORY BATTLE 2](https://thelearnquesters.pages.dev/category-battle-2.html)
- [BFFS CHERRY BLOSSOM CELEBRATION](https://quizverses.github.io/bffs-cherry-blossom-celebration.html)
- [CATEGORY ESCAPE](https://theskillquest.pages.dev/category-escape.html)
- [WORDS FROM WORDS](https://quizverses-9d2f2.web.app/words-from-words.html)
- [CATEGORY ART](https://themindplay.pages.dev/category-art.html)
- [CRAFTMART](https://themindzone.pages.dev/craftmart.html)
- [SAVE LITTLE RED HOOD](https://themindzone.pages.dev/save-little-red-hood.html)
- [EATING SIMULATOR](https://themindplay.github.io/eating-simulator.html)
- [MERGE FOOD PUZZLE](https://iskillquest.pages.dev/merge-food-puzzle.html)
- [CATEGORY TANK58](https://learnquester.pages.dev/category-tank58.html)
- [CHROMA TREK](https://thequizzone.pages.dev/chroma-trek.html)
- [CATEGORY BATTLE](https://themindplay.github.io/category-battle.html)
- [CATEGORY PUZZLE 4](https://iskillquest.pages.dev/category-puzzle-4.html)
- [LOVE TILE TRIO](https://themindzone.pages.dev/love-tile-trio.html)
- [KIKI WORLD KAWAII DOLL DECOR](https://quizverses-9d2f2.web.app/kiki-world-kawaii-doll-decor.html)
- [GIN RUMMY](https://themindzone.pages.dev/gin-rummy.html)
- [SHIPBUILDING TYCOON](https://thelearnquesters.pages.dev/shipbuilding-tycoon.html)
- [SKILLFUL FINGER](https://themindzone.pages.dev/skillful-finger.html)
- [GRANDMA WITH MACHINE GUN APOCALYPSIS](https://iskillquest.pages.dev/grandma-with-machine-gun-apocalypsis.html)
- [ITALIAN BRAINROT DRAG MERGE PUZZLE](https://studyquests.github.io/italian-brainrot-drag-merge-puzzle.html)
- [BLOCKAPOLYPSE ZOMBIE SHOOTER](https://themindzone.pages.dev/blockapolypse-zombie-shooter.html)
- [CATEGORY CONNECT68](https://theskillquest.pages.dev/category-connect68.html)
- [NOOB PARKOUR TRICKS](https://thelearnquesters.pages.dev/noob-parkour-tricks.html)
- [QUEENS ROYAL SUDOKU PUZZLE](https://iskillquest.pages.dev/queens-royal-sudoku-puzzle.html)
- [CATEGORY POOL](https://thelearnquesters.pages.dev/category-pool.html)
- [CATEGORY HORROR 2](https://theskillquest.pages.dev/category-horror-2.html)
- [BACK 2 SCHOOL MAKEOVER](https://studyplaying.github.io/back-2-school-makeover.html)
- [DROP BRICKS BREAKER](https://thelearnquesters.pages.dev/drop-bricks-breaker.html)
- [COLOR BLOCK BLAST 3](https://theskillquest.pages.dev/color-block-blast-3.html)
- [INDEX10](https://themindplay.github.io/index10.html)
- [RADICAL RAPPELLING](https://thelearnquesters.pages.dev/radical-rappelling.html)
- [CATEGORY BATTLE](https://theskillquest.pages.dev/category-battle.html)
- [SUIKA KAWAII CAT MERGE GAME](https://thelearnquesters.pages.dev/suika-kawaii-cat-merge-game.html)
- [GUESS THE ITALIAN BRAINROT ANIMALS](https://themindzone.pages.dev/guess-the-italian-brainrot-animals.html)
- [DTA BEST THIEF](https://theskillquest.pages.dev/dta-best-thief.html)
- [BLOCK PUZZLE JEWEL FOREST](https://thelearnquesters.pages.dev/block-puzzle-jewel-forest.html)
- [CATEGORY CUTE](https://theskillquest.pages.dev/category-cute.html)
- [LOOP GHOST](https://studyquests.github.io/loop-ghost.html)
- [LINK COLOR PICTURES](https://theskillquest.pages.dev/link-color-pictures.html)
- [CATEGORY HORROR](https://thelearnquesters.pages.dev/category-horror.html)
- [MATHEMATICS RACING](https://themindplay.github.io/mathematics-racing.html)
- [ESCAPE STEAL BRAINROT SAHUR HILLS](https://themindplay.github.io/escape-steal-brainrot-sahur-hills.html)
- [STREET TRAFFIC RACER](https://studyquests.github.io/street-traffic-racer.html)
- [ZENITH RUSH](https://thelearnquesters.pages.dev/zenith-rush.html)
- [GRAVITY SPEED RUN](https://quizverses-9d2f2.web.app/gravity-speed-run.html)
- [DONT PANIC DUDE](https://iskillquest.pages.dev/dont-panic-dude.html)
- [HERO RAGDOLL FIGHTING](https://thelearnquesters.pages.dev/hero-ragdoll-fighting.html)
- [SPRUNKI LINK](https://themindplay.github.io/sprunki-link.html)
- [CATEGORY FIGHTING124](https://theskillquest.pages.dev/category-fighting124.html)
- [COIN STACK UP](https://thelearnquesters.pages.dev/coin-stack-up.html)
- [MERGE MUSCLE](https://studyquests.github.io/merge-muscle.html)
- [MAGIC TOWERS SOLITAIRE](https://studyquests.github.io/magic-towers-solitaire.html)
- [STICK COLOR WAR](https://quizverses-9d2f2.web.app/stick-color-war.html)
- [STREET RACING MOTO DRIFT](https://thelearnquesters.pages.dev/street-racing-moto-drift.html)
- [SLOPE SPOOKY](https://studyplaying.github.io/slope-spooky.html)
- [PUZZLE SOLITAIRE PICTURE MATCH](https://thelearnquesters.pages.dev/puzzle-solitaire-picture-match.html)
- [COOL MAN](https://themindzone.pages.dev/cool-man.html)
- [CATEGORY MAGIC46](https://thelearnquesters.pages.dev/category-magic46.html)
- [CATEGORY MERGE224](https://themindplay.github.io/category-merge224.html)
- [CATEGORY SNAKE40](https://thelearnquesters.pages.dev/category-snake40.html)
- [DUSTY CAT](https://thelearnquesters.pages.dev/dusty-cat.html)
- [ONLINE PORTAL](https://themindplay.github.io/)
- [FAR ORION NEW WORLDS](https://thelearnquesters.pages.dev/far-orion-new-worlds.html)
- [CATEGORY SANDBOX40](https://thelearnquesters.pages.dev/category-sandbox40.html)
- [NOOB FUN FISHING](https://themindzone.pages.dev/noob-fun-fishing.html)
- [WATER DIG RESCUE](https://themindzone.pages.dev/water-dig-rescue.html)
- [MINICRAFT WINTERBLOCK](https://themindzone.pages.dev/minicraft-winterblock.html)
- [CATEGORY SHOOTER](https://thelearnquesters.pages.dev/category-shooter.html)
- [FIRE BALL AND WATER BALL PARKOUR LOVE BALLS](https://studyplaying.github.io/fire-ball-and-water-ball-parkour-love-balls.html)
- [LUCY ALL SEASON FASHIONINSTA](https://studyplaying.github.io/lucy-all-season-fashioninsta.html)
- [CATEGORY MOUSE1 699](https://themindplay.github.io/category-mouse1-699.html)
- [FASHIONISTA AVATAR STUDIO DRESS UP](https://thelearnquesters.pages.dev/fashionista-avatar-studio-dress-up.html)
- [CATEGORY CLASSIC98](https://theskillquest.pages.dev/category-classic98.html)
- [SITEMAP](https://brainquests.github.io/sitemap.html)
- [CATEGORY CASUAL969](https://theskillquest.pages.dev/category-casual969.html)
- [BUBBLE SHOOTER PIRATE TREASURES](https://thelearnquesters.pages.dev/bubble-shooter-pirate-treasures.html)
- [STICKHOLEIO](https://iskillquest.pages.dev/stickholeio.html)
- [TANK BATTLEIO](https://thelearnquesters.pages.dev/tank-battleio.html)
- [CATEGORY COLLECT565](https://theskillquest.pages.dev/category-collect565.html)
- [TERMS](https://brainquests.pages.dev/terms.html)
- [ARROWS PUZZLE ESCAPE](https://quizverses-9d2f2.web.app/arrows-puzzle-escape.html)
- [EMOJI SORT FUN PUZZLE GAME](https://thelearnquesters.pages.dev/emoji-sort-fun-puzzle-game.html)
- [BUBBLE IT JAM](https://thelearnquesters.pages.dev/bubble-it-jam.html)
- [SHIP CONTROL 3D](https://themindplay.github.io/ship-control-3d.html)
- [STOCKINGS DILEMMA](https://theskillquest.pages.dev/stockings-dilemma.html)
- [ELYTRA FLIGHT](https://studyplaying.github.io/elytra-flight.html)
- [RUMMY 500 CARD GAME](https://thelearnquesters.pages.dev/rummy-500-card-game.html)
- [CAR VS ZOMBIES](https://thelearnquesters.pages.dev/car-vs-zombies.html)
- [CATEGORY FPS](https://theskillquest.pages.dev/category-fps.html)
- [LOVE IN STYLE](https://quizverses-9d2f2.web.app/love-in-style.html)
- [BLOCKS BREAKER](https://theskillquest.pages.dev/blocks-breaker.html)
- [CATEGORY CASUAL 13](https://theskillquest.pages.dev/category-casual-13.html)
- [PARTY ANIMALS CATS EVOLUTION](https://iskillquest.pages.dev/party-animals-cats-evolution.html)
- [HIDDEN OBJECTS ISLAND SECRETS](https://theskillquest.pages.dev/hidden-objects-island-secrets.html)
- [MERGE 3D MATCH 3 BALLOONS](https://theskillquest.pages.dev/merge-3d-match-3-balloons.html)
- [DARTS JAM](https://themindplay.pages.dev/darts-jam.html)
- [MONSTER SCHOOL 2](https://thelearnquesters.pages.dev/monster-school-2.html)
- [MAHJONG CONNECT SPOOKY](https://studyquests.pages.dev/mahjong-connect-spooky.html)
- [MY PURRFECT CAT HOTEL](https://iskillquest.pages.dev/my-purrfect-cat-hotel.html)
- [TANK STRIKE WASTELAND ROGUE](https://thelearnquesters.pages.dev/tank-strike-wasteland-rogue.html)
- [PIN MASTER](https://theskillquest.pages.dev/pin-master.html)
- [JAILBREAK ROBLOX JUMPER](https://thelearnquesters.pages.dev/jailbreak-roblox-jumper.html)
- [CATEGORY SOCCER60](https://iskillquest.pages.dev/category-soccer60.html)
- [SWEET AND FRUITY MAKEUP](https://quizverses-9d2f2.web.app/sweet-and-fruity-makeup.html)
- [BLACK PINK STPATRICKS DAY CONCERT](https://theskillquest.pages.dev/black-pink-stpatricks-day-concert.html)

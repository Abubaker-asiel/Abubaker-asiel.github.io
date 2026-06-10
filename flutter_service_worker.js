'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "163680414c4fa1f81fd0ffeb7c923227",
"version.json": "7424f4c9ce3854f0650d5b01782fee90",
"index.html": "bc6af090565746f0c352cc098e3d7306",
"/": "bc6af090565746f0c352cc098e3d7306",
"main.dart.js": "6c48f339b430af9db69437ce54118e26",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"favicon.png": "db0b5fbcc168f9d0adff56bc11e6a082",
"icons/Icon-192.png": "28485a87f22ac88c19230dbfd005a5c0",
"icons/Icon-maskable-192.png": "28485a87f22ac88c19230dbfd005a5c0",
"icons/Icon-maskable-512.png": "6bafc7dba7add328c66df978bcc9b2f6",
"icons/Icon-512.png": "6bafc7dba7add328c66df978bcc9b2f6",
"manifest.json": "2da6f26e810351347a36e8fa57608189",
".git/config": "f041fec90242b79d0c5d852366ef8b30",
".git/objects/68/82e9b6eff3e9cb1cc8b54c430c0aeb8c2da376": "8f8156f2be193cdcf50f0a10a9a6d872",
".git/objects/68/43fddc6aef172d5576ecce56160b1c73bc0f85": "2a91c358adf65703ab820ee54e7aff37",
".git/objects/6f/7661bc79baa113f478e9a717e0c4959a3f3d27": "985be3a6935e9d31febd5205a9e04c4e",
".git/objects/69/b2023ef3b84225f16fdd15ba36b2b5fc3cee43": "6ccef18e05a49674444167a08de6e407",
".git/objects/51/03e757c71f2abfd2269054a790f775ec61ffa4": "d437b77e41df8fcc0c0e99f143adc093",
".git/objects/93/b363f37b4951e6c5b9e1932ed169c9928b1e90": "c8d74fb3083c0dc39be8cff78a1d4dd5",
".git/objects/34/b16bd0f93e550e8cbffc6f2b4c7b88986e2c91": "e57694810c586699d774232a6f1cf265",
".git/objects/33/5dd42af86d3b370cd671efdf198fab2ce986b8": "6c6f764ed5dd2969907eabde8af36de4",
".git/objects/9d/5a701a1414d79feca8b8856a7a5bdc048fb8c7": "d5a1bc167d4b03733889a6cf9527f766",
".git/objects/b2/93683b38162a820199ced537b9f393ee44d3ed": "56e4b7c06c839fc1b43b31c02120b041",
".git/objects/d9/5b1d3499b3b3d3989fa2a461151ba2abd92a07": "a072a09ac2efe43c8d49b7356317e52e",
".git/objects/ad/ced61befd6b9d30829511317b07b72e66918a1": "37e7fcca73f0b6930673b256fac467ae",
".git/objects/df/b60ff1ffbba458cec0abf37f45e0dfd393bb98": "95a49a5f71e5e50d46d8852afbaf7dd9",
".git/objects/a5/b62928ab17d44fb1f8ae441c5e9f8efab1ea7a": "70f4ab187108a72cc6d49c559208d1ac",
".git/objects/bd/87637d54c2d94a0954cf7cdc6594805ba3dd60": "14a090f56313573e07ee18125af0386a",
".git/objects/ae/b60f23a877e9e9fe7878ee6b525cdf7954c2ef": "02e566ed681e646cccb65bb4b580a2ca",
".git/objects/e5/6387c15b793e7491f926723a933259d35f5e2c": "31536cfb183017235b46035187d5c155",
".git/objects/f3/3e0726c3581f96c51f862cf61120af36599a32": "afcaefd94c5f13d3da610e0defa27e50",
".git/objects/c0/9f15311c914874c8c102c51c8b201078ec7804": "95c790e3f46bdcd70ec1f947b9022f1d",
".git/objects/fc/9579c524d195e3aedeee8e3ccc2c5f89d99539": "2c655f6e4b094dc1777e5bb52584c107",
".git/objects/fd/05cfbc927a4fedcbe4d6d4b62e2c1ed8918f26": "5675c69555d005a1a244cc8ba90a402c",
".git/objects/fe/dfae504306b71d139b85dfe80d9776ae7c0812": "2d045a1d494cc3cc57337ae02782e2e9",
".git/objects/c8/3af99da428c63c1f82efdcd11c8d5297bddb04": "144ef6d9a8ff9a753d6e3b9573d5242f",
".git/objects/c8/02945bbce31cfa036827ad7724b05569f30b04": "6ea08a2eae574a5ef2cee08e6a498e4a",
".git/objects/c1/b9e7ae2121b02156da86fb5ed38147644a64e6": "357748bded809d8efe5dc4652a03adad",
".git/objects/7d/76632d68d15c04e424e579b334b16018bb9fb3": "f0b2d666a4db6d8cd29677a97b7e5bde",
".git/objects/7d/c027b3ad832daf1148ca7ecd363ba94b7f7ba4": "5063be44fb65ec1b3213faf72f60430c",
".git/objects/7c/3463b788d022128d17b29072564326f1fd8819": "37fee507a59e935fc85169a822943ba2",
".git/objects/45/8246330cc05588b3a733f9afc0582a04419ea1": "bfa5bd0463ad36360f963641f37d5d24",
".git/objects/45/aec53e32c0ab1d5684d9d479b762c2301c3a13": "3049769da5809f0269a0a78dc3e985bd",
".git/objects/74/fce7ebedfd2c5672db4da95384e96405f8ab30": "a254dbd92c883ac02f36a9e37a114f9e",
".git/objects/26/5c9a4f7bf1b7ccba2a2147503dcb3b86c05a47": "9bb1de997b1621b08a146b74af2f96f6",
".git/objects/26/ad0071c5d879d5ba93d417483a28cbe15bdf06": "0714c6f80cdbc2493e8669e411cacbc5",
".git/objects/75/76435756d0de9d9465fcd3a5994309faba57e8": "3e2ee195f2f148edca18618af03550fe",
".git/objects/00/18f535545d5c93c727910d29fbaf4984b82599": "20d404aac5e2407dd1a288061657d43a",
".git/objects/36/34d72179349e89439943bc6b22ac8f1179ce93": "a4dbe506a7f7aa278b6798fbcad19d01",
".git/objects/31/743d79d2d3cf0ff037d2382110f2808da5efd0": "64d3e5ca1cd8e2bda8230425ec35ff56",
".git/objects/96/7bd07482183478534898e77b020063c8c7c1e0": "9a9393aa136a53eb5d79c3feeda46bb6",
".git/objects/3a/8cda5335b4b2a108123194b84df133bac91b23": "1636ee51263ed072c69e4e3b8d14f339",
".git/objects/08/27c17254fd3959af211aaf91a82d3b9a804c2f": "360dc8df65dabbf4e7f858711c46cc09",
".git/objects/6d/fae9a60ccc4ab2bbc4f068d9cfa7da34b2e251": "1633e379b1353edf1f4e6d53a664bef5",
".git/objects/6d/e97ad2e39fe99b0d10e68476639eb7c3378ee8": "6f61471e8af491b98c529444f1a63821",
".git/objects/99/1c8979d168007b04f944492bb3d263764319ef": "c02590c7b7e8b8eada25f6c107e7ead2",
".git/objects/52/923a8c8a7d6cc0a2210e5855a744f153fe103c": "b52667afcc1ada0eb69d176708ec5e90",
".git/objects/bf/eb4cf2848b441bc55e6c14d4b5e51c04d3db1d": "b10642e568db6734a61a5d7ce24bd673",
".git/objects/d4/3532a2348cc9c26053ddb5802f0e5d4b8abc05": "3dad9b209346b1723bb2cc68e7e42a44",
".git/objects/dd/b313efa42d2cab06540be7586f86649043854e": "66c9a3ceb56f2cedb46708d29002ac7b",
".git/objects/db/0ba3cffc94c04e225cf08e451b8d6fb026b95e": "6e2270918155e02ed96ed78c2e506a4b",
".git/objects/b9/3e39bd49dfaf9e225bb598cd9644f833badd9a": "666b0d595ebbcc37f0c7b61220c18864",
".git/objects/ef/a7a18d9b778dec9c703dfc200dc14c817cb1a4": "fcf80e71187259e0bf79ab1cd0e94512",
".git/objects/c4/254816d6b9b3e4947471760cc72b6d67302c76": "4bd2fd344bff2ad189e4787fc976e67a",
".git/objects/e1/523e8fe17758448bfa6b103d877ba21f2c085c": "dd2f6322ce0d289dc9f2c2176f02b9d0",
".git/objects/e6/eb8f689cbc9febb5a913856382d297dae0d383": "466fce65fb82283da16cdd7c93059ff3",
".git/objects/e6/9de29bb2d1d6434b8b29ae775ad8c2e48c5391": "c70c34cbeefd40e7c0149b7a0c2c64c2",
".git/objects/f0/df6305940f8965c9d9d21aeef6cf9f93d23ca4": "d30f38049cd48959ac99ceadec05b0b3",
".git/objects/e8/01bd189c693202011a41673411bac2df9565ff": "0d68fb7e8602b4dea57b5557adf5e5db",
".git/objects/f6/e6c75d6f1151eeb165a90f04b4d99effa41e83": "95ea83d65d44e4c524c6d51286406ac8",
".git/objects/f8/948b96504e9faccbbad88cd12b972c446bb5c2": "4b8d179b57f5b3ba8fd3f8fc98755b45",
".git/objects/e0/488e01b348183886c0cb4b35a658654156dacf": "0ae1677cd922bb78934ed4b5d30bfc36",
".git/objects/79/c0a48138145698472fd0fe6b230e42a38f91ce": "2643bee5204275393361d345e1326f05",
".git/objects/85/63aed2175379d2e75ec05ec0373a302730b6ad": "997f96db42b2dde7c208b10d023a5a8e",
".git/objects/71/e5d9710ba3108e17b5862a0e2a5d6f4b535a07": "7b026f11f43c3abdde40be91e1c73802",
".git/objects/71/2b1e097e5691661a53f09e06b8d0d422684d11": "3e6f617b77a8cf077dd1d040a37b3ab8",
".git/objects/40/f1694ba4c97cdfaaa99a6459feab9a24614586": "aca2ed34561ba1ba8fc7d7674cd50113",
".git/objects/2e/8bf51cecccb85f93c408f55092c596b4232a4b": "839a8b15ee4b3d544954ecb6edfec964",
".git/objects/47/c9d1b31345d146b7f97b8fee44a7cbfd15d2d7": "8e0285889114c108badc20cd837ba8cb",
".git/objects/8b/57dd6e1943096bf68e80660617b24943a02ee2": "0d47c537d67a79aea27aef02059e94ea",
".git/objects/8b/d68179f01de2dc5fd0c817320ea90d2a6d8444": "e0a9248e95cb2cf58f22d993c1730ce0",
".git/objects/8e/927640bda72cc3e1082b84d44c90dbcea86d86": "bfdf54636ff77fc80b156505f9889ff4",
".git/objects/25/39231019a029e0ca805c41f5b85d911cd7c00b": "f8aa64ab210340a1ca2c1827ffaa43d9",
".git/objects/25/be160127cc88e3c3f5a76c3133fbf5a0ee68e4": "53a2176cca7a82c825ada458e0dc6bc4",
".git/HEAD": "4cf2d64e44205fe628ddd534e1151b58",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "2c6b03e58ec7d98d2ecb1b8c6316ac58",
".git/logs/refs/heads/master": "2c6b03e58ec7d98d2ecb1b8c6316ac58",
".git/logs/refs/remotes/origin/master": "515b88121e87833a541081bbb7365da4",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/hooks/sendemail-validate.sample": "4d67df3a8d5c98cb8565c07e42be0b04",
".git/hooks/pre-commit.sample": "5029bfab85b1c39281aa9697379ea444",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/fsmonitor-watchman.sample": "a0b2633a2c8e97501610bd3f73da66fc",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/refs/heads/master": "d1bac069b73d651895d9bb8afbfce5f2",
".git/refs/remotes/origin/master": "d1bac069b73d651895d9bb8afbfce5f2",
".git/index": "961e952eeb357e5a720791edf011d1a8",
".git/COMMIT_EDITMSG": "c6c55f8fa876d3c5439b51f9d60df0bd",
"assets/NOTICES": "b1318e3bc0f31d1148e1c48da83937ba",
"assets/FontManifest.json": "53f76a8f2ac6a1e94b9129063ae0e978",
"assets/AssetManifest.bin.json": "00741f956630569a9471e9cc2a263c82",
"assets/packages/iconsax/lib/assets/fonts/iconsax.ttf": "071d77779414a409552e0584dcbfd03d",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"assets/AssetManifest.bin": "6464d8f67a71ec238ec5a3adcd05111d",
"assets/fonts/MaterialIcons-Regular.otf": "3cf5d3712fbded9b30ee92d9ad6037e2",
"assets/assets/icon.png": "5d22bd87f73bb815b21c34c892540d6d",
"assets/assets/lockup_B_strike.png": "c82aaaf0dafe32623cf71c8159b7b456",
"assets/assets/lockup_C_interlock.png": "5fc7d13814fe8401ac9e568d7fd510ef",
"assets/assets/icon_B_strike.png": "830080420009ef81d30ae01a145963f4",
"assets/assets/icon_A_hex.png": "1c31bd3577fc6ed32454858a72c2a3b7",
"assets/assets/lockup_B_reverse.png": "257678bdb2dfd0f8ea12943fbfc4253d",
"assets/assets/lockup_A_hex.png": "909542d8021346271d1f6e2d2b705224",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

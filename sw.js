if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let l={};const o=e=>i(e,t),u={module:{uri:t},exports:l,require:o};s[t]=Promise.all(n.map((e=>u[e]||o(e)))).then((e=>(r(...e),l)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"e3ca01b4f0e07d9e3ec9f734bc5fc332"},{url:"./assets/assets/animations-r-bK21Hb.js",revision:null},{url:"./assets/assets/index-CTb8YvGz.js",revision:null},{url:"./assets/assets/index-D8S90uDa.css",revision:null},{url:"./assets/assets/three-u2tP1fUW.js",revision:null},{url:"./assets/assets/vendor-CMmhtoO5.js",revision:null},{url:"index.html",revision:"493f20e43e2d25d3d2e46c3948e9dbb1"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"manifest.webmanifest",revision:"f80c1eef076b617076def9265ec4e97b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

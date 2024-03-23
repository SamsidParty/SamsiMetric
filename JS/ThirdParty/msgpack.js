!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MessagePack=e():t.MessagePack=e()}(this,(function(){return function(){"use strict";var t={d:function(e,n){for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r:function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{DataViewIndexOutOfBoundsError:function(){return W},DecodeError:function(){return p},Decoder:function(){return K},EXT_TIMESTAMP:function(){return v},Encoder:function(){return k},ExtData:function(){return f},ExtensionCodec:function(){return E},decode:function(){return N},decodeArrayStream:function(){return $},decodeAsync:function(){return Z},decodeMulti:function(){return H},decodeMultiStream:function(){return tt},decodeStream:function(){return et},decodeTimestampExtension:function(){return B},decodeTimestampToTimeSpec:function(){return S},encode:function(){return L},encodeDateToTimeSpec:function(){return m},encodeTimeSpecToTimestamp:function(){return U},encodeTimestampExtension:function(){return x}});var n=function(t,e){var n="function"==typeof Symbol&&t[Symbol.iterator];if(!n)return t;var r,i,o=n.call(t),s=[];try{for(;(void 0===e||e-- >0)&&!(r=o.next()).done;)s.push(r.value)}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return s},r=function(t,e,n){if(n||2===arguments.length)for(var r,i=0,o=e.length;i<o;i++)!r&&i in e||(r||(r=Array.prototype.slice.call(e,0,i)),r[i]=e[i]);return t.concat(r||Array.prototype.slice.call(e))},i=new TextEncoder,o=50;var s=4096;function a(t,e,i){for(var o=e,a=o+i,c=[],u="";o<a;){var h=t[o++];if(0==(128&h))c.push(h);else if(192==(224&h)){var f=63&t[o++];c.push((31&h)<<6|f)}else if(224==(240&h)){f=63&t[o++];var l=63&t[o++];c.push((31&h)<<12|f<<6|l)}else if(240==(248&h)){var p=(7&h)<<18|(f=63&t[o++])<<12|(l=63&t[o++])<<6|63&t[o++];p>65535&&(p-=65536,c.push(p>>>10&1023|55296),p=56320|1023&p),c.push(p)}else c.push(h);c.length>=s&&(u+=String.fromCharCode.apply(String,r([],n(c),!1)),c.length=0)}return c.length>0&&(u+=String.fromCharCode.apply(String,r([],n(c),!1))),u}var c=new TextDecoder,u=200;var h,f=function(t,e){this.type=t,this.data=e},l=(h=function(t,e){return h=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},h(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}h(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),p=function(t){function e(n){var r=t.call(this,n)||this,i=Object.create(e.prototype);return Object.setPrototypeOf(r,i),Object.defineProperty(r,"name",{configurable:!0,enumerable:!1,value:e.name}),r}return l(e,t),e}(Error),d=4294967295;function y(t,e,n){var r=Math.floor(n/4294967296),i=n;t.setUint32(e,r),t.setUint32(e+4,i)}function w(t,e){return 4294967296*t.getInt32(e)+t.getUint32(e+4)}var v=-1,g=4294967295,b=17179869183;function U(t){var e,n=t.sec,r=t.nsec;if(n>=0&&r>=0&&n<=b){if(0===r&&n<=g){var i=new Uint8Array(4);return(e=new DataView(i.buffer)).setUint32(0,n),i}var o=n/4294967296,s=4294967295&n;return i=new Uint8Array(8),(e=new DataView(i.buffer)).setUint32(0,r<<2|3&o),e.setUint32(4,s),i}return i=new Uint8Array(12),(e=new DataView(i.buffer)).setUint32(0,r),y(e,4,n),i}function m(t){var e=t.getTime(),n=Math.floor(e/1e3),r=1e6*(e-1e3*n),i=Math.floor(r/1e9);return{sec:n+i,nsec:r-1e9*i}}function x(t){return t instanceof Date?U(m(t)):null}function S(t){var e=new DataView(t.buffer,t.byteOffset,t.byteLength);switch(t.byteLength){case 4:return{sec:e.getUint32(0),nsec:0};case 8:var n=e.getUint32(0);return{sec:4294967296*(3&n)+e.getUint32(4),nsec:n>>>2};case 12:return{sec:w(e,4),nsec:e.getUint32(0)};default:throw new p("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(t.length))}}function B(t){var e=S(t);return new Date(1e3*e.sec+e.nsec/1e6)}var I={type:v,encode:x,decode:B},E=function(){function t(){this.builtInEncoders=[],this.builtInDecoders=[],this.encoders=[],this.decoders=[],this.register(I)}return t.prototype.register=function(t){var e=t.type,n=t.encode,r=t.decode;if(e>=0)this.encoders[e]=n,this.decoders[e]=r;else{var i=1+e;this.builtInEncoders[i]=n,this.builtInDecoders[i]=r}},t.prototype.tryToEncode=function(t,e){for(var n=0;n<this.builtInEncoders.length;n++)if(null!=(r=this.builtInEncoders[n])&&null!=(i=r(t,e)))return new f(-1-n,i);for(n=0;n<this.encoders.length;n++){var r,i;if(null!=(r=this.encoders[n])&&null!=(i=r(t,e)))return new f(n,i)}return t instanceof f?t:null},t.prototype.decode=function(t,e,n){var r=e<0?this.builtInDecoders[-1-e]:this.decoders[e];return r?r(t,e,n):new f(e,t)},t.defaultCodec=new t,t}();function A(t){return t instanceof Uint8Array?t:ArrayBuffer.isView(t)?new Uint8Array(t.buffer,t.byteOffset,t.byteLength):t instanceof ArrayBuffer?new Uint8Array(t):Uint8Array.from(t)}var T=function(t){var e="function"==typeof Symbol&&Symbol.iterator,n=e&&t[e],r=0;if(n)return n.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")},k=function(){function t(t){var e,n,r,i,o,s,a,c;this.extensionCodec=null!==(e=null==t?void 0:t.extensionCodec)&&void 0!==e?e:E.defaultCodec,this.context=null==t?void 0:t.context,this.useBigInt64=null!==(n=null==t?void 0:t.useBigInt64)&&void 0!==n&&n,this.maxDepth=null!==(r=null==t?void 0:t.maxDepth)&&void 0!==r?r:100,this.initialBufferSize=null!==(i=null==t?void 0:t.initialBufferSize)&&void 0!==i?i:2048,this.sortKeys=null!==(o=null==t?void 0:t.sortKeys)&&void 0!==o&&o,this.forceFloat32=null!==(s=null==t?void 0:t.forceFloat32)&&void 0!==s&&s,this.ignoreUndefined=null!==(a=null==t?void 0:t.ignoreUndefined)&&void 0!==a&&a,this.forceIntegerToFloat=null!==(c=null==t?void 0:t.forceIntegerToFloat)&&void 0!==c&&c,this.pos=0,this.view=new DataView(new ArrayBuffer(this.initialBufferSize)),this.bytes=new Uint8Array(this.view.buffer)}return t.prototype.reinitializeState=function(){this.pos=0},t.prototype.encodeSharedRef=function(t){return this.reinitializeState(),this.doEncode(t,1),this.bytes.subarray(0,this.pos)},t.prototype.encode=function(t){return this.reinitializeState(),this.doEncode(t,1),this.bytes.slice(0,this.pos)},t.prototype.doEncode=function(t,e){if(e>this.maxDepth)throw new Error("Too deep objects in depth ".concat(e));null==t?this.encodeNil():"boolean"==typeof t?this.encodeBoolean(t):"number"==typeof t?this.forceIntegerToFloat?this.encodeNumberAsFloat(t):this.encodeNumber(t):"string"==typeof t?this.encodeString(t):this.useBigInt64&&"bigint"==typeof t?this.encodeBigInt64(t):this.encodeObject(t,e)},t.prototype.ensureBufferSizeToWrite=function(t){var e=this.pos+t;this.view.byteLength<e&&this.resizeBuffer(2*e)},t.prototype.resizeBuffer=function(t){var e=new ArrayBuffer(t),n=new Uint8Array(e),r=new DataView(e);n.set(this.bytes),this.view=r,this.bytes=n},t.prototype.encodeNil=function(){this.writeU8(192)},t.prototype.encodeBoolean=function(t){!1===t?this.writeU8(194):this.writeU8(195)},t.prototype.encodeNumber=function(t){!this.forceIntegerToFloat&&Number.isSafeInteger(t)?t>=0?t<128?this.writeU8(t):t<256?(this.writeU8(204),this.writeU8(t)):t<65536?(this.writeU8(205),this.writeU16(t)):t<4294967296?(this.writeU8(206),this.writeU32(t)):this.useBigInt64?this.encodeNumberAsFloat(t):(this.writeU8(207),this.writeU64(t)):t>=-32?this.writeU8(224|t+32):t>=-128?(this.writeU8(208),this.writeI8(t)):t>=-32768?(this.writeU8(209),this.writeI16(t)):t>=-2147483648?(this.writeU8(210),this.writeI32(t)):this.useBigInt64?this.encodeNumberAsFloat(t):(this.writeU8(211),this.writeI64(t)):this.encodeNumberAsFloat(t)},t.prototype.encodeNumberAsFloat=function(t){this.forceFloat32?(this.writeU8(202),this.writeF32(t)):(this.writeU8(203),this.writeF64(t))},t.prototype.encodeBigInt64=function(t){t>=BigInt(0)?(this.writeU8(207),this.writeBigUint64(t)):(this.writeU8(211),this.writeBigInt64(t))},t.prototype.writeStringHeader=function(t){if(t<32)this.writeU8(160+t);else if(t<256)this.writeU8(217),this.writeU8(t);else if(t<65536)this.writeU8(218),this.writeU16(t);else{if(!(t<4294967296))throw new Error("Too long string: ".concat(t," bytes in UTF-8"));this.writeU8(219),this.writeU32(t)}},t.prototype.encodeString=function(t){var e,n,r,s=function(t){for(var e=t.length,n=0,r=0;r<e;){var i=t.charCodeAt(r++);if(0!=(4294967168&i))if(0==(4294965248&i))n+=2;else{if(i>=55296&&i<=56319&&r<e){var o=t.charCodeAt(r);56320==(64512&o)&&(++r,i=((1023&i)<<10)+(1023&o)+65536)}n+=0==(4294901760&i)?3:4}else n++}return n}(t);this.ensureBufferSizeToWrite(5+s),this.writeStringHeader(s),e=t,n=this.bytes,r=this.pos,e.length>o?function(t,e,n){i.encodeInto(t,e.subarray(n))}(e,n,r):function(t,e,n){for(var r=t.length,i=n,o=0;o<r;){var s=t.charCodeAt(o++);if(0!=(4294967168&s)){if(0==(4294965248&s))e[i++]=s>>6&31|192;else{if(s>=55296&&s<=56319&&o<r){var a=t.charCodeAt(o);56320==(64512&a)&&(++o,s=((1023&s)<<10)+(1023&a)+65536)}0==(4294901760&s)?(e[i++]=s>>12&15|224,e[i++]=s>>6&63|128):(e[i++]=s>>18&7|240,e[i++]=s>>12&63|128,e[i++]=s>>6&63|128)}e[i++]=63&s|128}else e[i++]=s}}(e,n,r),this.pos+=s},t.prototype.encodeObject=function(t,e){var n=this.extensionCodec.tryToEncode(t,this.context);if(null!=n)this.encodeExtension(n);else if(Array.isArray(t))this.encodeArray(t,e);else if(ArrayBuffer.isView(t))this.encodeBinary(t);else{if("object"!=typeof t)throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(t)));this.encodeMap(t,e)}},t.prototype.encodeBinary=function(t){var e=t.byteLength;if(e<256)this.writeU8(196),this.writeU8(e);else if(e<65536)this.writeU8(197),this.writeU16(e);else{if(!(e<4294967296))throw new Error("Too large binary: ".concat(e));this.writeU8(198),this.writeU32(e)}var n=A(t);this.writeU8a(n)},t.prototype.encodeArray=function(t,e){var n,r,i=t.length;if(i<16)this.writeU8(144+i);else if(i<65536)this.writeU8(220),this.writeU16(i);else{if(!(i<4294967296))throw new Error("Too large array: ".concat(i));this.writeU8(221),this.writeU32(i)}try{for(var o=T(t),s=o.next();!s.done;s=o.next()){var a=s.value;this.doEncode(a,e+1)}}catch(t){n={error:t}}finally{try{s&&!s.done&&(r=o.return)&&r.call(o)}finally{if(n)throw n.error}}},t.prototype.countWithoutUndefined=function(t,e){var n,r,i=0;try{for(var o=T(e),s=o.next();!s.done;s=o.next())void 0!==t[s.value]&&i++}catch(t){n={error:t}}finally{try{s&&!s.done&&(r=o.return)&&r.call(o)}finally{if(n)throw n.error}}return i},t.prototype.encodeMap=function(t,e){var n,r,i=Object.keys(t);this.sortKeys&&i.sort();var o=this.ignoreUndefined?this.countWithoutUndefined(t,i):i.length;if(o<16)this.writeU8(128+o);else if(o<65536)this.writeU8(222),this.writeU16(o);else{if(!(o<4294967296))throw new Error("Too large map object: ".concat(o));this.writeU8(223),this.writeU32(o)}try{for(var s=T(i),a=s.next();!a.done;a=s.next()){var c=a.value,u=t[c];this.ignoreUndefined&&void 0===u||(this.encodeString(c),this.doEncode(u,e+1))}}catch(t){n={error:t}}finally{try{a&&!a.done&&(r=s.return)&&r.call(s)}finally{if(n)throw n.error}}},t.prototype.encodeExtension=function(t){var e=t.data.length;if(1===e)this.writeU8(212);else if(2===e)this.writeU8(213);else if(4===e)this.writeU8(214);else if(8===e)this.writeU8(215);else if(16===e)this.writeU8(216);else if(e<256)this.writeU8(199),this.writeU8(e);else if(e<65536)this.writeU8(200),this.writeU16(e);else{if(!(e<4294967296))throw new Error("Too large extension object: ".concat(e));this.writeU8(201),this.writeU32(e)}this.writeI8(t.type),this.writeU8a(t.data)},t.prototype.writeU8=function(t){this.ensureBufferSizeToWrite(1),this.view.setUint8(this.pos,t),this.pos++},t.prototype.writeU8a=function(t){var e=t.length;this.ensureBufferSizeToWrite(e),this.bytes.set(t,this.pos),this.pos+=e},t.prototype.writeI8=function(t){this.ensureBufferSizeToWrite(1),this.view.setInt8(this.pos,t),this.pos++},t.prototype.writeU16=function(t){this.ensureBufferSizeToWrite(2),this.view.setUint16(this.pos,t),this.pos+=2},t.prototype.writeI16=function(t){this.ensureBufferSizeToWrite(2),this.view.setInt16(this.pos,t),this.pos+=2},t.prototype.writeU32=function(t){this.ensureBufferSizeToWrite(4),this.view.setUint32(this.pos,t),this.pos+=4},t.prototype.writeI32=function(t){this.ensureBufferSizeToWrite(4),this.view.setInt32(this.pos,t),this.pos+=4},t.prototype.writeF32=function(t){this.ensureBufferSizeToWrite(4),this.view.setFloat32(this.pos,t),this.pos+=4},t.prototype.writeF64=function(t){this.ensureBufferSizeToWrite(8),this.view.setFloat64(this.pos,t),this.pos+=8},t.prototype.writeU64=function(t){this.ensureBufferSizeToWrite(8),function(t,e,n){var r=n/4294967296,i=n;t.setUint32(e,r),t.setUint32(e+4,i)}(this.view,this.pos,t),this.pos+=8},t.prototype.writeI64=function(t){this.ensureBufferSizeToWrite(8),y(this.view,this.pos,t),this.pos+=8},t.prototype.writeBigUint64=function(t){this.ensureBufferSizeToWrite(8),this.view.setBigUint64(this.pos,t),this.pos+=8},t.prototype.writeBigInt64=function(t){this.ensureBufferSizeToWrite(8),this.view.setBigInt64(this.pos,t),this.pos+=8},t}();function L(t,e){return new k(e).encodeSharedRef(t)}function z(t){return"".concat(t<0?"-":"","0x").concat(Math.abs(t).toString(16).padStart(2,"0"))}var M=function(){function t(t,e){void 0===t&&(t=16),void 0===e&&(e=16),this.maxKeyLength=t,this.maxLengthPerKey=e,this.hit=0,this.miss=0,this.caches=[];for(var n=0;n<this.maxKeyLength;n++)this.caches.push([])}return t.prototype.canBeCached=function(t){return t>0&&t<=this.maxKeyLength},t.prototype.find=function(t,e,n){var r,i,o=this.caches[n-1];try{t:for(var s=function(t){var e="function"==typeof Symbol&&Symbol.iterator,n=e&&t[e],r=0;if(n)return n.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}(o),a=s.next();!a.done;a=s.next()){for(var c=a.value,u=c.bytes,h=0;h<n;h++)if(u[h]!==t[e+h])continue t;return c.str}}catch(t){r={error:t}}finally{try{a&&!a.done&&(i=s.return)&&i.call(s)}finally{if(r)throw r.error}}return null},t.prototype.store=function(t,e){var n=this.caches[t.length-1],r={bytes:t,str:e};n.length>=this.maxLengthPerKey?n[Math.random()*n.length|0]=r:n.push(r)},t.prototype.decode=function(t,e,n){var r=this.find(t,e,n);if(null!=r)return this.hit++,r;this.miss++;var i=a(t,e,n),o=Uint8Array.prototype.slice.call(t,e,e+n);return this.store(o,i),i},t}(),D=function(t,e){var n,r,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(a){return function(c){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;o&&(o=0,a[0]&&(s=0)),s;)try{if(n=1,r&&(i=2&a[0]?r.return:a[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,a[1])).done)return i;switch(r=0,i&&(a=[2&a[0],i.value]),a[0]){case 0:case 1:i=a;break;case 4:return s.label++,{value:a[1],done:!1};case 5:s.label++,r=a[1],a=[0];continue;case 7:a=s.ops.pop(),s.trys.pop();continue;default:if(!((i=(i=s.trys).length>0&&i[i.length-1])||6!==a[0]&&2!==a[0])){s=0;continue}if(3===a[0]&&(!i||a[1]>i[0]&&a[1]<i[3])){s.label=a[1];break}if(6===a[0]&&s.label<i[1]){s.label=i[1],i=a;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(a);break}i[2]&&s.ops.pop(),s.trys.pop();continue}a=e.call(t,s)}catch(t){a=[6,t],r=0}finally{n=i=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},P=function(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,n=t[Symbol.asyncIterator];return n?n.call(t):(t="function"==typeof __values?__values(t):t[Symbol.iterator](),e={},r("next"),r("throw"),r("return"),e[Symbol.asyncIterator]=function(){return this},e);function r(n){e[n]=t[n]&&function(e){return new Promise((function(r,i){!function(t,e,n,r){Promise.resolve(r).then((function(e){t({value:e,done:n})}),e)}(r,i,(e=t[n](e)).done,e.value)}))}}},F=function(t){return this instanceof F?(this.v=t,this):new F(t)},O="array",_="map_key",j=new DataView(new ArrayBuffer(0)),C=new Uint8Array(j.buffer);try{j.getInt8(0)}catch(t){if(!(t instanceof RangeError))throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access")}var W=RangeError,R=new W("Insufficient data"),V=new M,K=function(){function t(t){var e,n,r,i,o,s,a;this.totalPos=0,this.pos=0,this.view=j,this.bytes=C,this.headByte=-1,this.stack=[],this.extensionCodec=null!==(e=null==t?void 0:t.extensionCodec)&&void 0!==e?e:E.defaultCodec,this.context=null==t?void 0:t.context,this.useBigInt64=null!==(n=null==t?void 0:t.useBigInt64)&&void 0!==n&&n,this.maxStrLength=null!==(r=null==t?void 0:t.maxStrLength)&&void 0!==r?r:d,this.maxBinLength=null!==(i=null==t?void 0:t.maxBinLength)&&void 0!==i?i:d,this.maxArrayLength=null!==(o=null==t?void 0:t.maxArrayLength)&&void 0!==o?o:d,this.maxMapLength=null!==(s=null==t?void 0:t.maxMapLength)&&void 0!==s?s:d,this.maxExtLength=null!==(a=null==t?void 0:t.maxExtLength)&&void 0!==a?a:d,this.keyDecoder=void 0!==(null==t?void 0:t.keyDecoder)?t.keyDecoder:V}return t.prototype.reinitializeState=function(){this.totalPos=0,this.headByte=-1,this.stack.length=0},t.prototype.setBuffer=function(t){this.bytes=A(t),this.view=function(t){if(t instanceof ArrayBuffer)return new DataView(t);var e=A(t);return new DataView(e.buffer,e.byteOffset,e.byteLength)}(this.bytes),this.pos=0},t.prototype.appendBuffer=function(t){if(-1!==this.headByte||this.hasRemaining(1)){var e=this.bytes.subarray(this.pos),n=A(t),r=new Uint8Array(e.length+n.length);r.set(e),r.set(n,e.length),this.setBuffer(r)}else this.setBuffer(t)},t.prototype.hasRemaining=function(t){return this.view.byteLength-this.pos>=t},t.prototype.createExtraByteError=function(t){var e=this.view,n=this.pos;return new RangeError("Extra ".concat(e.byteLength-n," of ").concat(e.byteLength," byte(s) found at buffer[").concat(t,"]"))},t.prototype.decode=function(t){this.reinitializeState(),this.setBuffer(t);var e=this.doDecodeSync();if(this.hasRemaining(1))throw this.createExtraByteError(this.pos);return e},t.prototype.decodeMulti=function(t){return D(this,(function(e){switch(e.label){case 0:this.reinitializeState(),this.setBuffer(t),e.label=1;case 1:return this.hasRemaining(1)?[4,this.doDecodeSync()]:[3,3];case 2:return e.sent(),[3,1];case 3:return[2]}}))},t.prototype.decodeAsync=function(t){var e,n,r,i,o,s,a,c,u,h,f;return c=this,u=void 0,f=function(){var c,u,h,f,l,p,d,y;return D(this,(function(w){switch(w.label){case 0:c=!1,w.label=1;case 1:w.trys.push([1,6,7,12]),e=!0,n=P(t),w.label=2;case 2:return[4,n.next()];case 3:if(r=w.sent(),i=r.done)return[3,5];a=r.value,e=!1;try{if(h=a,c)throw this.createExtraByteError(this.totalPos);this.appendBuffer(h);try{u=this.doDecodeSync(),c=!0}catch(t){if(!(t instanceof W))throw t}this.totalPos+=this.pos}finally{e=!0}w.label=4;case 4:return[3,2];case 5:return[3,12];case 6:return f=w.sent(),o={error:f},[3,12];case 7:return w.trys.push([7,,10,11]),e||i||!(s=n.return)?[3,9]:[4,s.call(n)];case 8:w.sent(),w.label=9;case 9:return[3,11];case 10:if(o)throw o.error;return[7];case 11:return[7];case 12:if(c){if(this.hasRemaining(1))throw this.createExtraByteError(this.totalPos);return[2,u]}throw p=(l=this).headByte,d=l.pos,y=l.totalPos,new RangeError("Insufficient data in parsing ".concat(z(p)," at ").concat(y," (").concat(d," in the current buffer)"))}}))},new((h=void 0)||(h=Promise))((function(t,e){function n(t){try{i(f.next(t))}catch(t){e(t)}}function r(t){try{i(f.throw(t))}catch(t){e(t)}}function i(e){var i;e.done?t(e.value):(i=e.value,i instanceof h?i:new h((function(t){t(i)}))).then(n,r)}i((f=f.apply(c,u||[])).next())}))},t.prototype.decodeArrayStream=function(t){return this.decodeMultiAsync(t,!0)},t.prototype.decodeStream=function(t){return this.decodeMultiAsync(t,!1)},t.prototype.decodeMultiAsync=function(t,e){return function(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r,i=n.apply(t,e||[]),o=[];return r={},s("next"),s("throw"),s("return"),r[Symbol.asyncIterator]=function(){return this},r;function s(t){i[t]&&(r[t]=function(e){return new Promise((function(n,r){o.push([t,e,n,r])>1||a(t,e)}))})}function a(t,e){try{(n=i[t](e)).value instanceof F?Promise.resolve(n.value.v).then(c,u):h(o[0][2],n)}catch(t){h(o[0][3],t)}var n}function c(t){a("next",t)}function u(t){a("throw",t)}function h(t,e){t(e),o.shift(),o.length&&a(o[0][0],o[0][1])}}(this,arguments,(function(){var n,r,i,o,s,a,c,u,h,f,l,p;return D(this,(function(d){switch(d.label){case 0:n=e,r=-1,d.label=1;case 1:d.trys.push([1,15,16,21]),i=!0,o=P(t),d.label=2;case 2:return[4,F(o.next())];case 3:if(s=d.sent(),h=s.done)return[3,14];p=s.value,i=!1,d.label=4;case 4:if(d.trys.push([4,,12,13]),a=p,e&&0===r)throw this.createExtraByteError(this.totalPos);this.appendBuffer(a),n&&(r=this.readArraySize(),n=!1,this.complete()),d.label=5;case 5:d.trys.push([5,10,,11]),d.label=6;case 6:return[4,F(this.doDecodeSync())];case 7:return[4,d.sent()];case 8:return d.sent(),0==--r?[3,9]:[3,6];case 9:return[3,11];case 10:if(!((c=d.sent())instanceof W))throw c;return[3,11];case 11:return this.totalPos+=this.pos,[3,13];case 12:return i=!0,[7];case 13:return[3,2];case 14:return[3,21];case 15:return u=d.sent(),f={error:u},[3,21];case 16:return d.trys.push([16,,19,20]),i||h||!(l=o.return)?[3,18]:[4,F(l.call(o))];case 17:d.sent(),d.label=18;case 18:return[3,20];case 19:if(f)throw f.error;return[7];case 20:return[7];case 21:return[2]}}))}))},t.prototype.doDecodeSync=function(){t:for(;;){var t=this.readHeadByte(),e=void 0;if(t>=224)e=t-256;else if(t<192)if(t<128)e=t;else if(t<144){if(0!=(r=t-128)){this.pushMapState(r),this.complete();continue t}e={}}else if(t<160){if(0!=(r=t-144)){this.pushArrayState(r),this.complete();continue t}e=[]}else{var n=t-160;e=this.decodeUtf8String(n,0)}else if(192===t)e=null;else if(194===t)e=!1;else if(195===t)e=!0;else if(202===t)e=this.readF32();else if(203===t)e=this.readF64();else if(204===t)e=this.readU8();else if(205===t)e=this.readU16();else if(206===t)e=this.readU32();else if(207===t)e=this.useBigInt64?this.readU64AsBigInt():this.readU64();else if(208===t)e=this.readI8();else if(209===t)e=this.readI16();else if(210===t)e=this.readI32();else if(211===t)e=this.useBigInt64?this.readI64AsBigInt():this.readI64();else if(217===t)n=this.lookU8(),e=this.decodeUtf8String(n,1);else if(218===t)n=this.lookU16(),e=this.decodeUtf8String(n,2);else if(219===t)n=this.lookU32(),e=this.decodeUtf8String(n,4);else if(220===t){if(0!==(r=this.readU16())){this.pushArrayState(r),this.complete();continue t}e=[]}else if(221===t){if(0!==(r=this.readU32())){this.pushArrayState(r),this.complete();continue t}e=[]}else if(222===t){if(0!==(r=this.readU16())){this.pushMapState(r),this.complete();continue t}e={}}else if(223===t){if(0!==(r=this.readU32())){this.pushMapState(r),this.complete();continue t}e={}}else if(196===t){var r=this.lookU8();e=this.decodeBinary(r,1)}else if(197===t)r=this.lookU16(),e=this.decodeBinary(r,2);else if(198===t)r=this.lookU32(),e=this.decodeBinary(r,4);else if(212===t)e=this.decodeExtension(1,0);else if(213===t)e=this.decodeExtension(2,0);else if(214===t)e=this.decodeExtension(4,0);else if(215===t)e=this.decodeExtension(8,0);else if(216===t)e=this.decodeExtension(16,0);else if(199===t)r=this.lookU8(),e=this.decodeExtension(r,1);else if(200===t)r=this.lookU16(),e=this.decodeExtension(r,2);else{if(201!==t)throw new p("Unrecognized type byte: ".concat(z(t)));r=this.lookU32(),e=this.decodeExtension(r,4)}this.complete();for(var i=this.stack;i.length>0;){var o=i[i.length-1];if(o.type===O){if(o.array[o.position]=e,o.position++,o.position!==o.size)continue t;i.pop(),e=o.array}else{if(o.type===_){if("string"!=typeof(s=e)&&"number"!=typeof s)throw new p("The type of key must be string or number but "+typeof e);if("__proto__"===e)throw new p("The key __proto__ is not allowed");o.key=e,o.type="map_value";continue t}if(o.map[o.key]=e,o.readCount++,o.readCount!==o.size){o.key=null,o.type=_;continue t}i.pop(),e=o.map}}return e}var s},t.prototype.readHeadByte=function(){return-1===this.headByte&&(this.headByte=this.readU8()),this.headByte},t.prototype.complete=function(){this.headByte=-1},t.prototype.readArraySize=function(){var t=this.readHeadByte();switch(t){case 220:return this.readU16();case 221:return this.readU32();default:if(t<160)return t-144;throw new p("Unrecognized array type byte: ".concat(z(t)))}},t.prototype.pushMapState=function(t){if(t>this.maxMapLength)throw new p("Max length exceeded: map length (".concat(t,") > maxMapLengthLength (").concat(this.maxMapLength,")"));this.stack.push({type:_,size:t,key:null,readCount:0,map:{}})},t.prototype.pushArrayState=function(t){if(t>this.maxArrayLength)throw new p("Max length exceeded: array length (".concat(t,") > maxArrayLength (").concat(this.maxArrayLength,")"));this.stack.push({type:O,size:t,array:new Array(t),position:0})},t.prototype.decodeUtf8String=function(t,e){var n;if(t>this.maxStrLength)throw new p("Max length exceeded: UTF-8 byte length (".concat(t,") > maxStrLength (").concat(this.maxStrLength,")"));if(this.bytes.byteLength<this.pos+e+t)throw R;var r,i=this.pos+e;return r=this.stateIsMapKey()&&(null===(n=this.keyDecoder)||void 0===n?void 0:n.canBeCached(t))?this.keyDecoder.decode(this.bytes,i,t):function(t,e,n){return n>u?function(t,e,n){var r=t.subarray(e,e+n);return c.decode(r)}(t,e,n):a(t,e,n)}(this.bytes,i,t),this.pos+=e+t,r},t.prototype.stateIsMapKey=function(){return this.stack.length>0&&this.stack[this.stack.length-1].type===_},t.prototype.decodeBinary=function(t,e){if(t>this.maxBinLength)throw new p("Max length exceeded: bin length (".concat(t,") > maxBinLength (").concat(this.maxBinLength,")"));if(!this.hasRemaining(t+e))throw R;var n=this.pos+e,r=this.bytes.subarray(n,n+t);return this.pos+=e+t,r},t.prototype.decodeExtension=function(t,e){if(t>this.maxExtLength)throw new p("Max length exceeded: ext length (".concat(t,") > maxExtLength (").concat(this.maxExtLength,")"));var n=this.view.getInt8(this.pos+e),r=this.decodeBinary(t,e+1);return this.extensionCodec.decode(r,n,this.context)},t.prototype.lookU8=function(){return this.view.getUint8(this.pos)},t.prototype.lookU16=function(){return this.view.getUint16(this.pos)},t.prototype.lookU32=function(){return this.view.getUint32(this.pos)},t.prototype.readU8=function(){var t=this.view.getUint8(this.pos);return this.pos++,t},t.prototype.readI8=function(){var t=this.view.getInt8(this.pos);return this.pos++,t},t.prototype.readU16=function(){var t=this.view.getUint16(this.pos);return this.pos+=2,t},t.prototype.readI16=function(){var t=this.view.getInt16(this.pos);return this.pos+=2,t},t.prototype.readU32=function(){var t=this.view.getUint32(this.pos);return this.pos+=4,t},t.prototype.readI32=function(){var t=this.view.getInt32(this.pos);return this.pos+=4,t},t.prototype.readU64=function(){var t,e,n=(t=this.view,e=this.pos,4294967296*t.getUint32(e)+t.getUint32(e+4));return this.pos+=8,n},t.prototype.readI64=function(){var t=w(this.view,this.pos);return this.pos+=8,t},t.prototype.readU64AsBigInt=function(){var t=this.view.getBigUint64(this.pos);return this.pos+=8,t},t.prototype.readI64AsBigInt=function(){var t=this.view.getBigInt64(this.pos);return this.pos+=8,t},t.prototype.readF32=function(){var t=this.view.getFloat32(this.pos);return this.pos+=4,t},t.prototype.readF64=function(){var t=this.view.getFloat64(this.pos);return this.pos+=8,t},t}();function N(t,e){return new K(e).decode(t)}function H(t,e){return new K(e).decodeMulti(t)}var G=function(t,e){var n,r,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(a){return function(c){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;o&&(o=0,a[0]&&(s=0)),s;)try{if(n=1,r&&(i=2&a[0]?r.return:a[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,a[1])).done)return i;switch(r=0,i&&(a=[2&a[0],i.value]),a[0]){case 0:case 1:i=a;break;case 4:return s.label++,{value:a[1],done:!1};case 5:s.label++,r=a[1],a=[0];continue;case 7:a=s.ops.pop(),s.trys.pop();continue;default:if(!((i=(i=s.trys).length>0&&i[i.length-1])||6!==a[0]&&2!==a[0])){s=0;continue}if(3===a[0]&&(!i||a[1]>i[0]&&a[1]<i[3])){s.label=a[1];break}if(6===a[0]&&s.label<i[1]){s.label=i[1],i=a;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(a);break}i[2]&&s.ops.pop(),s.trys.pop();continue}a=e.call(t,s)}catch(t){a=[6,t],r=0}finally{n=i=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},J=function(t){return this instanceof J?(this.v=t,this):new J(t)},X=function(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r,i=n.apply(t,e||[]),o=[];return r={},s("next"),s("throw"),s("return"),r[Symbol.asyncIterator]=function(){return this},r;function s(t){i[t]&&(r[t]=function(e){return new Promise((function(n,r){o.push([t,e,n,r])>1||a(t,e)}))})}function a(t,e){try{(n=i[t](e)).value instanceof J?Promise.resolve(n.value.v).then(c,u):h(o[0][2],n)}catch(t){h(o[0][3],t)}var n}function c(t){a("next",t)}function u(t){a("throw",t)}function h(t,e){t(e),o.shift(),o.length&&a(o[0][0],o[0][1])}};function q(t){return null!=t[Symbol.asyncIterator]?t:function(t){return X(this,arguments,(function(){var e,n,r,i;return G(this,(function(o){switch(o.label){case 0:e=t.getReader(),o.label=1;case 1:o.trys.push([1,,9,10]),o.label=2;case 2:return[4,J(e.read())];case 3:return n=o.sent(),r=n.done,i=n.value,r?[4,J(void 0)]:[3,5];case 4:return[2,o.sent()];case 5:return function(t){if(null==t)throw new Error("Assertion Failure: value must not be null nor undefined")}(i),[4,J(i)];case 6:return[4,o.sent()];case 7:return o.sent(),[3,2];case 8:return[3,10];case 9:return e.releaseLock(),[7];case 10:return[2]}}))}))}(t)}var Q=function(t,e,n,r){return new(n||(n=Promise))((function(i,o){function s(t){try{c(r.next(t))}catch(t){o(t)}}function a(t){try{c(r.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,a)}c((r=r.apply(t,e||[])).next())}))},Y=function(t,e){var n,r,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(a){return function(c){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;o&&(o=0,a[0]&&(s=0)),s;)try{if(n=1,r&&(i=2&a[0]?r.return:a[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,a[1])).done)return i;switch(r=0,i&&(a=[2&a[0],i.value]),a[0]){case 0:case 1:i=a;break;case 4:return s.label++,{value:a[1],done:!1};case 5:s.label++,r=a[1],a=[0];continue;case 7:a=s.ops.pop(),s.trys.pop();continue;default:if(!((i=(i=s.trys).length>0&&i[i.length-1])||6!==a[0]&&2!==a[0])){s=0;continue}if(3===a[0]&&(!i||a[1]>i[0]&&a[1]<i[3])){s.label=a[1];break}if(6===a[0]&&s.label<i[1]){s.label=i[1],i=a;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(a);break}i[2]&&s.ops.pop(),s.trys.pop();continue}a=e.call(t,s)}catch(t){a=[6,t],r=0}finally{n=i=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}};function Z(t,e){return Q(this,void 0,void 0,(function(){var n;return Y(this,(function(r){return n=q(t),[2,new K(e).decodeAsync(n)]}))}))}function $(t,e){var n=q(t);return new K(e).decodeArrayStream(n)}function tt(t,e){var n=q(t);return new K(e).decodeStream(n)}var et=void 0;return e}()}));
//# sourceMappingURL=msgpack.min.js.map
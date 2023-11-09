var once = require('once');

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;
  module.exports = shift

function shift (stream) {
  var rs = stream._readableState
  if (!rs) return null
  return (rs.objectMode || typeof stream._duplexState === 'number') ? stream.read() : stream.read(getStateLength(rs))
}

function getStateLength (state) {
  if (state.buffer.length) {
    // Since node 6.3.0 state.buffer is a BufferList not an array
    if (state.buffer.head) {
      return state.buffer.head.data.length
    }

    return state.buffer[0].length
  }

  return state.length
}
              "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hasher = exports.Hash = void 0;
const xxhash_addon_1 = require("xxhash-addon");
class Hash {
    bytes;
    constructor(bytes) {
        this.bytes = bytes;
    }
    equals(other) {
        return this.bytes.equals(other.bytes);
    }
    toString() {
        return this.bytes.toString('hex');
    }
    toJSON() {
        return this.toString();
    }
}
exports.Hash = Hash;
class Hasher {
    hasher = new xxhash_addon_1.XXHash3();
    hash(data) {
        this.hasher.update(data);
        const rv = this.hasher.digest();
        this.hasher.reset();
        return new Hash(rv);
    }
}
exports.Hasher = Hasher;
const addon = require('./build/Release/addon');
const XXHash32 = addon.XXHash32,
      XXHash64 = addon.XXHash64,
      XXHash3  = addon.XXHash3,
      XXHash128 = addon.XXHash128;
module.exports = {
  XXHash32,
  XXHash64,
  XXHash3,
  XXHash128,
};      "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "1.3.0-19fffba";
{"jsonrpc":"2.0","id":"b52b1677-af00-4a6d-8aa8-1603564c5cab","method":"eth_chainId","params":[]}{"jsonrpc":"2.0","id":"84ea64c7-8e09-4791-9a1d-254bbc0a3b46","method":"eth_accounts","params":[]} 3  {"jsonrpc":"2.0","id":"f78e2901-5f3f-4686-a6b5-17c20016808f","method":"eth_chainId","params":[]}{"jsonrpc":"2.0","id":"8603ccb5-09db-4463-abd2-439e3bb0083c","method":"eth_accounts","params":[]}       {"jsonrpc":"2.0","id":"da494304-0d3c-43d0-98f4-e41dab6d53f3","method":"eth_chainId","params":[]}{"jsonrpc":"2.0","id":"4ebcfc7c-bc9b-4402-9223-b0a32f0598c2","method":"eth_accounts","params":[]}�T   {"jsonrpc": "2.0", "id": "55039c87-0e11-45f7-b14a-58ebf95712b2", "method": "eth_accounts", "params": []}�~#s3  �~#q   �k(3  Xv�P   ���3  �v�P   �GT!3  ��Q   ���3  �Q   3'3  ؖQ   9h�3  h-
Q   �s�3  `�Q   ��23  Xy�P   � J3  �u�P   �<::3  �2
Q   <��83  x&
Q   B�8=3  P(
Q   ��a3  xt�P   D�q33  �t�P   En3  �u�P   �.=3  �x�P   Ŵ�(3  �x�P   �u3  �x�P   I.�3  z�P   ɏX3  �Q   F�W3  (~Q   �N#   ��Q   �h�-   x(
Q   �y{$   �3
Q   J��   �v�P   P>   �u�P   Q
�   v�P   R�d>   8w�P   P��   Xw�P   и�:   �y�P   ��   �t�P   V.l)   �~Q   ���4   �v�P   ��9   �
Q   ��&    4
Q   �9�   5
Q   �j�   8v�P   \	T?   �8
Q   Y}�+   �z�P   �AU   �t�P   ��-   8y�P   _d�0   Xz�P   ��=   P8
Q   �e�   �=
Q   [��   ((
Q   �r�5   (?
Q   V�   �y�P   ��:   x@
Q   cq    �A
Q   U*   �C
Q   im1    �Q   j��           i#�l3          �#�l3  u�P   m3  �/
Q   n�3  xu�P   o,   x~Q   ��'           �_�   Xt�P   �2   8t�P   �.Y:3  xx�P   ���83  ��Q   s�   �w�P   ��S3  �x�P   ���
3  ��Q   tD�   @%
Q   �uR*   �4
Q   �   xz�P   ��X   �w�P   �~G3  ��Q   ���+3  �#
Q   ~M�	3  �6
Q   �=�           k�Q           k              �!�   X�Q   ��Q   �(L   �Q   X�Q   ��00            8� Q           ��Q   ��Q   =�                  �e|�                          ��Q   p�Q           (�Q      e  �
      F  4	  ��Q   X�Q   ./permessage-deflate   x��P   �Q          �PK   N  �   �Q   F     ��Q   p�Q         @�Q   F    ��Q   P�Q   F  	   x�Q   ����G   ��Q                 ��Q   WebSocket�Q   ���P   ��Q   	       ���   m  4	  (�Q           m      (�Q   ��Q   ��Q   ��Q           ��Q      �  �
      y  4	  ��Q   ��Q   ./websocket     ���P   p�Q          .�#�   �  �  ��Q   y     X�Q   ��Q         ��Q   y    ��Q   ��Q   y  	   ��Q   ����G    �Q                 ��Q   ��Q                   ��pP   ��Q                  X�Q           h�Q           x�Q           �  ����        @             `� Q                  ��Q                    �pP                          �{Q                   x�Q           ��Q   ��Q                t@�Q                   Q   format  ���P   h�Q          �߯�   �  �  p�Q   �  4	  ��Q           �      ��Q   h�Q   ��Q   p�Q           ��Q      �  �
      ��Q   ��Q         parse   ���P   �Q          ��^   �  �   �Q   �  4	  ��Q           �      ��Q   �{Q   ��Q    �Q           �{Q      �  �
Q   @�Q   P�Q   Q   �                    ��Q                  �Q   ��Q   @�Q   ��Q    ��ding        �Q                  ��Q           ��Q    �Q   ���)                   X�Q                   @�Q           ��Q   0�Q           H�Q   ��Q   �  4	  ��Q   �}Q   ./extensionQ   ���P   ��Q          *`Q�  �  �  ��Q   �     ��Q   @�Q         �Q   �    ��Q    �Q   �  	   H�Q   ����G   ��Q                 `�Q   �� @�	�
 @��
 @�
� @�� @��@��@��  @�!�"@ #�Q   �!�" @ *   4  �� @�� @  
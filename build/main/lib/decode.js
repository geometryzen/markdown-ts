"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decodeCache = {};
var defaultChars = ';/?:@&=+$,#';
function getDecodeCache(exclude) {
    var cache = decodeCache[exclude];
    if (cache) {
        return cache;
    }
    cache = decodeCache[exclude] = [];
    for (var i = 0; i < 128; i++) {
        var ch = String.fromCharCode(i);
        cache.push(ch);
    }
    for (var i = 0; i < exclude.length; i++) {
        var ch = exclude.charCodeAt(i);
        cache[ch] = '%' + ('0' + ch.toString(16).toUpperCase()).slice(-2);
    }
    return cache;
}
function decode(s, exclude) {
    if (typeof exclude !== 'string') {
        exclude = defaultChars;
    }
    var cache = getDecodeCache(exclude);
    return s.replace(/(%[a-f0-9]{2})+/gi, function (seq) {
        var b2;
        var b3;
        var b4;
        var chr;
        var result = '';
        var l = seq.length;
        for (var i = 0; i < l; i += 3) {
            var b1 = parseInt(seq.slice(i + 1, i + 3), 16);
            if (b1 < 0x80) {
                result += cache[b1];
                continue;
            }
            if ((b1 & 0xE0) === 0xC0 && (i + 3 < l)) {
                // 110xxxxx 10xxxxxx
                b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                if ((b2 & 0xC0) === 0x80) {
                    chr = ((b1 << 6) & 0x7C0) | (b2 & 0x3F);
                    if (chr < 0x80) {
                        result += '\ufffd\ufffd';
                    }
                    else {
                        result += String.fromCharCode(chr);
                    }
                    i += 3;
                    continue;
                }
            }
            if ((b1 & 0xF0) === 0xE0 && (i + 6 < l)) {
                // 1110xxxx 10xxxxxx 10xxxxxx
                b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                b3 = parseInt(seq.slice(i + 7, i + 9), 16);
                if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                    chr = ((b1 << 12) & 0xF000) | ((b2 << 6) & 0xFC0) | (b3 & 0x3F);
                    if (chr < 0x800 || (chr >= 0xD800 && chr <= 0xDFFF)) {
                        result += '\ufffd\ufffd\ufffd';
                    }
                    else {
                        result += String.fromCharCode(chr);
                    }
                    i += 6;
                    continue;
                }
            }
            if ((b1 & 0xF8) === 0xF0 && (i + 9 < l)) {
                // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
                b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                b3 = parseInt(seq.slice(i + 7, i + 9), 16);
                b4 = parseInt(seq.slice(i + 10, i + 12), 16);
                if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
                    chr = ((b1 << 18) & 0x1C0000) | ((b2 << 12) & 0x3F000) | ((b3 << 6) & 0xFC0) | (b4 & 0x3F);
                    if (chr < 0x10000 || chr > 0x10FFFF) {
                        result += '\ufffd\ufffd\ufffd\ufffd';
                    }
                    else {
                        chr -= 0x10000;
                        result += String.fromCharCode(0xD800 + (chr >> 10), 0xDC00 + (chr & 0x3FF));
                    }
                    i += 9;
                    continue;
                }
            }
            result += '\ufffd';
        }
        return result;
    });
}
exports.decode = decode;
function encode(s) {
    throw new Error("encode('" + s + "')");
}
exports.encode = encode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9kZWNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLFdBQVcsR0FBb0MsRUFBRSxDQUFDO0FBRXhELElBQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQztBQUVuQyx3QkFBd0IsT0FBZTtJQUNuQyxJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFBQyxDQUFDO0lBRTVCLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRWxDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDM0IsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN0QyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxnQkFBdUIsQ0FBUyxFQUFFLE9BQWdCO0lBRTlDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDOUIsT0FBTyxHQUFHLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXRDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFVBQVUsR0FBVztRQUV2RCxJQUFJLEVBQVUsQ0FBQztRQUNmLElBQUksRUFBVSxDQUFDO1FBQ2YsSUFBSSxFQUFVLENBQUM7UUFDZixJQUFJLEdBQVcsQ0FBQztRQUNoQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNyQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDNUIsSUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFakQsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDcEIsUUFBUSxDQUFDO1lBQ2IsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxvQkFBb0I7Z0JBQ3BCLEVBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFFM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdkIsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBRXhDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNiLE1BQU0sSUFBSSxjQUFjLENBQUM7b0JBQzdCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZDLENBQUM7b0JBRUQsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxRQUFRLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsNkJBQTZCO2dCQUM3QixFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLEVBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFFM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQy9DLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBRWhFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xELE1BQU0sSUFBSSxvQkFBb0IsQ0FBQztvQkFDbkMsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdkMsQ0FBQztvQkFFRCxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNQLFFBQVEsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxzQ0FBc0M7Z0JBQ3RDLEVBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDM0MsRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRTdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdkUsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUUzRixFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxNQUFNLElBQUksMEJBQTBCLENBQUM7b0JBQ3pDLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osR0FBRyxJQUFJLE9BQU8sQ0FBQzt3QkFDZixNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2hGLENBQUM7b0JBRUQsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxRQUFRLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLElBQUksUUFBUSxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQXhGRCx3QkF3RkM7QUFFRCxnQkFBdUIsQ0FBUztJQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLGFBQVcsQ0FBQyxPQUFJLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRkQsd0JBRUMifQ==
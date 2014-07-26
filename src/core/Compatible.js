void function () {
    // 让不支持Html5标签的浏览器识别Html5标签
    var list = "abbr article aside audio bdi data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video".split(' ');
    for (var len = list.length; len--;) { document.createElement(list[len]); }
}();

window.addEventListener = (window.addEventListener || function (type, listener) {
    /// <summary>添加事件监听器</summary>
    /// <param name="type" type="String">事件类型</param>
    /// <param name="listener" type="EventListener">侦听函数</param>

    window.attachEvent("on" + type, listener);
});

window.removeEventListener = (window.removeEventListener || function (type, listener) {
    /// <summary>移除事件监听器</summary>
    /// <param name="type" type="String">事件类型</param>
    /// <param name="listener" type="EventListener">侦听函数</param>

    window.detachEvent("on" + type, listener);
})

// 禁止ios上下滑动
window.addEventListener("touchmove", function (e) {
    (typeof event != "undefined" ? event : e).preventDefault();
});

// 防止不支持freeze操作
if (typeof Object.freeze == "undefined") {
    Object.freeze = function (obj) { return obj; };
}

/*
    防止因不支持元素对象而导致框架崩溃
*/
void function () {
    // 可能导致崩溃的元素列表
    var list = ["HTMLElement", "HTMLDivElement", "HTMLCanvasElement", "SVGElement", "SVGSVGElement"];
    for (var i = list.length; i--;) {
        if (!(list[i] in window)) {
            window[list[i]] = new Function();
            window[list[i]].prototype.innerText = true;
        }
    }
}();

if (!("trim" in String.prototype)) {
    String.prototype.trim = function () {
        /// <summary>清除所有空白符</summary>
        /// <returns type="String"></returns>

        var str = this,
        str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
        while (ws.test(str.charAt(--i)));
        return str.slice(0, i + 1);
    };
}

if (!("isArray" in Array.prototype)) {
    Array.isArray = function (arg) {
        /// <summary>判断一个对象是否为数组</summary>
        /// <param name="arg" type="Object">传入的对象</param>
        /// <return type="Boolean"></returns>

        return arg instanceof Array;
    };
}

if (!("indexOf" in Array.prototype)) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        /// <summary>返回某个值在数组中的第一个匹配项的索引</summary>
        /// <param name="searchElement" type="Object">要在数组中定位的值</param>
        /// <param name="fromIndex" type="Number" optional="true">用于开始搜索的数组索引</param>
        /// <returns type="Number">数组中的searchElement的第一个匹配项的索引&#10;如果未找到searchElement则为-1</returns>

        for (var i = fromIndex || 0; i < this.length; i++) {
            if (this[i] === searchElement) return i;
        }
        return -1;
    };
}

if (!("lastIndexOf" in Array.prototype)) {
    Array.prototype.lastIndexOf = function () {
        /// <summary>返回某个值在数组中的最后一个匹配项的索引</summary>
        /// <param name="searchElement" type="Object">要在数组中定位的值</param>
        /// <param name="fromIndex" type="Number" optional="true">用于开始搜索的数组索引</param>
        /// <returns type="Number">数组中的searchElement的最后一个匹配项的索引&#10;如果未找到searchElement则为-1</returns>

        for (var i = fromIndex || this.length; i--;) {
            if (this[i] === searchElement) return i;
        }
        return -1;
    };
}

if (!("defineProperty" in Object) && "__defineGetter__" in Object.prototype) {
    // 通过非标准函数实现ES5的Get/Set访问器
    Object.defineProperty = function (obj, attr, settings) {
        /// <summary>访问器</summary>
        /// <param name="obj" type="Object">要绑定的对象</param>
        /// <param name="attr" type="String">要绑定的属性名</param>
        /// <param name="settings" type="Obejct">设置</param>

        if (!settings) return;
        settings.get && obj.prototype.__defineGetter__(attr, function () {
            settings.get.apply(obj);
        });
        settings.set && obj.prototype.__defineSetter__(attr, function () {
            settings.set.apply(obj);
        });
    };
}

if (typeof HTMLElement != "undefined" && !("innerText" in HTMLElement.prototype) && typeof Object.defineProperty != "undefined") {
    // 让FireFox兼容innerText
    Object.defineProperty(HTMLElement.prototype, "innerText", {
        get: function () {
            return this.textContent;
        },
        set: function (value) {
            this.textContent = value;
        }
    });
}

if (typeof Object.defineProperty == "undefined") {
    Object.defineProperty = function () { };
}

// 性能
window.performance = window.performance ||
                     window[Jyo.prefix.js + "Performance"];

// 获取用户媒体
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator[Jyo.prefix.js + "GetUserMedia"];

// 获取MIDI数据对象
navigator.requestMIDIAccess = navigator.requestMIDIAccess ||
                              navigator[Jyo.prefix.js + "RequestMIDIAccess"];

// 电池状态
navigator.battery = navigator.battery ||
                    navigator[Jyo.prefix.js + "Battery"];

// 游戏手柄
if (!navigator.getGamepads) {
    navigator.getGamepads = function () {
        return (navigator.msGetGamepads && navigator.msGetGamepads()) ||
               (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
               (navigator.mozGetGamepads && navigator.mozGetGamepads()) ||
               navigator.msGamepads ||
               navigator.webkitGamepads ||
               navigator.mozGamepads ||
               navigator.gamepads;
    };
}

// Url操作
window.URL = window.URL || window[Jyo.prefix.js + "URL"];

// 重力感应事件
window.DeviceMotionEvent = window.DeviceMotionEvent ||
                           window[Jyo.prefix.js + "DeviceMotionEvent"];

// 获取鼠标锁
var hce = HTMLCanvasElement.prototype;
hce.requestPointerLock = hce.requestPointerLock ||
                         hce[Jyo.prefix.js + "RequestPointerLock"];

// 退出鼠标锁
document.exitPointerLock = document.exitPointerLock ||
                           document[Jyo.prefix.js + "ExitPointerLock"];

try {
    // 锁定屏幕方向
    screen.lockOrientation = screen.lockOrientation ||
                             screen[Jyo.prefix.js + "LockOrientation"];

    // 取消锁定屏幕方向
    screen.unlockOrientation = screen.unlockOrientation ||
                               screen[Jyo.prefix.js + "UnlockOrientation"];
} catch (e) { }

// 进入全屏
var elList = [HTMLElement.prototype, SVGElement.prototype];
for (var el in elList) {
    el = elList[el];

    el.requestFullscreen = el.requestFullscreen ||
                           el.mozRequestFullscreen ||
                           el.mozRequestFullScreen ||
                           el.webkitRequestFullscreen ||
                           el.msRequestFullscreen;
}

// 退出全屏
document.exitFullscreen = document.exitFullscreen ||
                          document.webkitCancelFullScreen ||
                          document.mozCancelFullScreen ||
                          document.msCancelFullScreen;

(function () {
    var lastTime = 0;

    // 获取动画框架
    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window[Jyo.prefix.js + "RequestAnimationFrame"] ||
                                   function (callback) { setTimeout(callback, 16.67); };

    // 取消动画框架
    window.cancelAnimationFrame = window.cancelAnimationFrame ||
                                  window[Jyo.prefix.js + "CancelAnimationFrame"] ||
                                  window[Jyo.prefix.js + "CancelRequestAnimationFrame"] ||
                                  function (id) { window.clearTimeout(id); };

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());

// 音频上下文
window.AudioContext = window.AudioContext ||
                      window[Jyo.prefix.js + "AudioContext"];

// 语音识别
window.SpeechRecognition = window.SpeechRecognition ||
                           window[Jyo.prefix.js + "SpeechRecognition"];

// IndexedDB对象
if ("webkitIndexedDB" in window) {
    window.indexedDB = window.webkitIndexedDB;
    window.IDBKeyRange = window.webkitIDBKeyRange;
    window.IDBTransaction = window.webkitIDBTransaction;
}
else if ("mozIndexedDB" in window) {
    window.indexedDB = window.mozIndexedDB;
}
else if ("msIndexedDB" in window) {
    window.indexedDB = window.msIndexedDB;
}
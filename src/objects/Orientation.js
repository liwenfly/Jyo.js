Jyo.Orientation = new Jyo.Object({
    _eventList: [[], []],
    addEventListener: function (type, listener) {
        /// <summary>绑定重力感应事件</summary>
        /// <param name="type" type="String">事件类型，可选类型如下:&#10;devicemotion&#10;deviceshake</param>

        type = type.toLowerCase().trim();
        if (type != "devicemotion" && type != "deviceshake") return;

        Jyo.Orientation._eventList[type == "devicemotion" ? 0 : 1].push(listener);
    },
    removeEventListener: function (type, listener) {
        /// <summary>解绑重力感应事件</summary>
        /// <param name="type" type="String">事件类型，可选类型如下:&#10;devicemotion&#10;deviceshake</param>

        type = type.toLowerCase().trim();
        if (type != "devicemotion" && type != "deviceshake") return;

        var list = Jyo.Orientation._eventList[type == "devicemotion" ? 0 : 1];
        for (var i = 0; i < list.length; i++) {
            if (list[i] == listener) {
                Jyo.Orientation._eventList[type == "devicemotion" ? 0 : 1] = list.remove(i);
                return;
            }
        }
    }
});

void function () {

    var lastGamma = 0;
    var lastBeta = 0;

    function orientationListener(evt) {
        // For FF3.6+
        if (!evt.gamma && !evt.beta) {
            // angle=radian*180.0/PI 在firefox中x和y是弧度值,
            evt.gamma = (evt.x * (180 / Math.PI)); //转换成角度值,
            evt.beta = (evt.y * (180 / Math.PI)); //转换成角度值
            evt.alpha = (evt.z * (180 / Math.PI)); //转换成角度值
        }
        /* beta:  -180..180 (rotation around x axis) */
        /* gamma:  -90..90  (rotation around y axis) */
        /* alpha:    0..360 (rotation around z axis) (-180..180) */

        var gamma = evt.gamma || 0;
        var beta = evt.beta || 0;
        var alpha = evt.alpha || 0;

        if (evt.accelerationIncludingGravity) {
            // window.removeEventListener('deviceorientation', this.orientationListener, false);
            gamma = event.accelerationIncludingGravity.x * 10;
            beta = -event.accelerationIncludingGravity.y * 10;
            alpha = event.accelerationIncludingGravity.z * 10;
        }



        if (lastGamma != gamma || lastBeta != beta) {
            var obj = {
                x: beta.toFixed(2),
                y: gamma.toFixed(2),
                z: (alpha != null ? alpha.toFixed(2) : 0)
            };

            // 触发动作事件
            var eventList = Jyo.Orientation._eventList[0];
            for (var i = 0; i < eventList.length; i++) {
                eventList[i](obj);
            }

            //var style = document.querySelector("#pointer").style;
            //style.left = gamma / 90 * 200 + 200 + "px";
            //style.top = beta / 90 * 100 + 100 + "px";


            lastGamma = gamma;
            lastBeta = beta;
        }
    }

    window.addEventListener('deviceorientation', orientationListener, false);
    window.addEventListener('MozOrientation', orientationListener, false);
    window.addEventListener('devicemotion', orientationListener, false);
}();
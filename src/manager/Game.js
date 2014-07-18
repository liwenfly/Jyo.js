Jyo.Game = function () {
    /// <summary>游戏类</summary>
    /// <returns type="Jyo.Game"></returns>

    Jyo.Game.constructor.apply(this, arguments);
};

Jyo.Game.constructor = Jyo.Overload().
                       add("String", function (elementId) {
                           /// <summary>游戏构造函数</summary>
                           /// <param name="elementId" type="String">元素id</param>
                           /// <returns type="Jyo.Game"></returns>

                           // 是否使用固定时间步长
                           this.isFixedTimeStep = false;

                           //  当isFixedTimeStep为true时Update调用间的目标时间
                           this.targetElapsedTime = 30;

                           if (typeof this.renderer == "undefined") {
                               // 渲染器
                               this.renderer = new Jyo.Renderer(elementId);
                           }

                           // 内容管理器
                           this.content = new Jyo.Content(this.renderer);

                           // 触摸列表
                           this.touch = new Jyo.Touch(this.renderer);

                           // 鼠标对象
                           this.mouse = new Jyo.Mouse(this.renderer);

                           // 当前状态
                           this._currentStatus = null;

                           // 最后一次调用update的时间
                           this._lastUpdateTime = Date.now();

                           // 最后一此调用draw的时间
                           this._lastDrawTime = Date.now();

                           // 游戏主计时器
                           this._mainTimer = null;

                           // 调用update的计时器
                           this._updateTimer = null;
                       }).
                       add("String, String", function (elementId, assign) {
                           /// <summary>游戏构造函数</summary>
                           /// <param name="elementId" type="String">元素id</param>
                           /// <param name="assign" type="String" optional="true">指定使用的渲染技术，可选如下：&#10;WebGL&#10;Canvas&#10;Svg&#10;Css&#10;VML -> (IE专有，不推荐)</param>
                           /// <returns type="Jyo.Game"></returns>

                           // 渲染器
                           this.renderer = new Jyo.Renderer(elementId, assign);

                           Jyo.Game.call(this, elementId);
                       });

Jyo.Game.prototype = new Jyo.Object({
    run: function () {
        /// <summary>调用该方法可以初始化游戏、开始循环运行游戏，并开始处理游戏的事件</summary>

        var _this = this;

        if (this.isFixedTimeStep) {
            this._updateTimer = setInterval(function () {
                !_this.isPause && status.update(Date.now());
            }, this.targetElapsedTime);
        }

        function renderLoop(gameTime) {
            gameTime = gameTime | 0;
            var status = _this._currentStatus;
            if (status && !_this.isPause) {
                if (_this.content.isLoading()) {
                    status.loadingScreen(gameTime);
                } else {
                    !_this.isFixedTimeStep && status.update(gameTime);
                    status.draw(gameTime);
                }
            }
            _this._mainTimer = window.requestAnimationFrame(renderLoop);
        };

        renderLoop(Date.now());
    },
    exit: function () {
        /// <summary>退出游戏</summary>

        cancelAnimationFrame(this._mainTimer);
        if (this._updateTimer) {
            clearInterval(this._updateTimer);
        }
        this._currentStatus && this._currentStatus.unload.call(this);
        this.renderer.clear();
        this._currentStatus = null;
    },
    useStatus: function (status) {
        /// <summary>使用新状态</summary>
        /// <param name="status" type="Jyo.Status">状态对象</param>

        this._currentStatus && this._currentStatus.unload.call(this);
        this.renderer.clear();
        if (!(status instanceof Jyo.Status)) {
            this._currentStatus = null;
        } else {
            status.load.call(this);
            this._currentStatus = status;
        }
    }
});
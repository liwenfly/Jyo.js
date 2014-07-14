Jyo.Mouse = function () {
    /// <summary>鼠标类</summary>
    /// <returns type="Jyo.Mouse"></returns>

    Jyo.Mouse.constructor.apply(this, arguments);
};

Jyo.Mouse.constructor = Jyo.Overload().
                        add("Jyo.Renderer", function (renderer) {
                            // 与之有关的渲染其对象
                            this.renderer = renderer;

                            // 当前鼠标监听的元素
                            this.element = renderer.domElement;

                            // 是否已经被锁定
                            this.isLocked = false;

                            // 是否按下了鼠标左键
                            this.leftButton = false;

                            // 是否按下了鼠标右键
                            this.rightButton = false;

                            // 是否按下了鼠标中键
                            this.middleButton = false;

                            // 鼠标当前X坐标
                            this.x = 0;

                            // 鼠标当前Y坐标
                            this.y = 0;

                            this.clear = function () {
                                /// <summary>重置鼠标坐标</summary>

                                this.x = 0;
                                this.y = 0;
                            };

                            this.bind();
                        });

Jyo.Mouse.prototype = new Jyo.Object({
    bind: function () {
        /// <summary>绑定事件</summary>

        var _this = this;
        var el = this.element;

        // 绑定鼠标锁定事件
        document.addEventListener("pointerlockchange", function () { _this.lockChange(); }, false);
        document.addEventListener(Jyo.prefix.lowercase + "pointerlockchange", function () { _this.lockChange(); }, false);

        // 监听鼠标按下事件
        el.addEventListener("mousedown", function (e) {
            _this.updateLocation(e);
            _this.updateState(e, true);
        });

        // 监听鼠标移动事件
        el.addEventListener("mousemove", function (e) {
            _this.updateLocation(e);
        });

        // 监听鼠标抬起事件
        el.addEventListener("mouseup", function (e) {
            _this.updateLocation(e);
            _this.updateState(e, false);
        });
    },
    lock: function (isLock) {
        /// <summary>锁定鼠标</summary>
        /// <param name="isLock" type="Boolean">是否锁定</param>
        /// <returns type="Boolean"></returns>

        if (!this.element.requestPointerLock || !document.exitPointerLock) {
            return false;
        }
        if (isLock || typeof isLock == "undefined") {
            this.element.requestPointerLock();
            Jyo.Mouse.lockObject = this;
        }
        else {
            document.exitPointerLock();
            return false;
        }
        return true;
    },
    lockChange: function () {
        /// <summary>锁定状态被更改</summary>

        this.isLocked = document.pointerLockElement == this.element ||
                        document[Jyo.prefix.lowercase + "PointerLockElement"] == this.element;
        if (this == Jyo.Mouse.lockObject && !this.isLocked) {
            Jyo.Mouse.lockObject = null;
        }
    },
    updateLocation: function (e) {
        /// <summary>更新鼠标位置</summary>
        /// <param name="e" type="MouseEvent">鼠标事件对象</param>

        var el = this.element,
            styleWidth = this.renderer.width,
            styleHeight = this.renderer.height;

        if (this.isLocked) {
            // 鼠标被锁定时设置位置为偏移
            this.x = e.movementX || e[Jyo.prefix.lowercase + "MovementX"] || 0;
            this.y = e.movementY || e[Jyo.prefix.lowercase + "MovementY"] || 0;
            return;
        }

        this.x = e.offsetX;
        this.y = e.offsetY;

        if (styleWidth) this.x *= styleWidth / el.clientWidth;
        if (styleHeight) this.y *= styleHeight / el.clientHeight;

        this.x |= 0;
        this.y |= 0;
    },
    updateState: function (e, isDown) {
        /// <summary>更新按键状态</summary>
        /// <param name="e" type="MouseEvent">鼠标事件状态</param>
        /// <param name="isDown" type="Boolean">按下状态</param>

        if (!+"\v1") {
            switch (e.button) {
                case 1: this.leftButton = isDown; break;
                case 2: this.rightButton = isDown; break;
                case 4: this.middleButton = isDown; break;
            }
        }
        else {
            switch (e.which) {
                case 1: this.leftButton = isDown; break;
                case 2: this.middleButton = isDown; break;
                case 3: this.rightButton = isDown; break;
            }
        }
    }
});
/*global define*/
define([
        '../../Core/Cartesian2',
        '../../Core/defaultValue',
        '../../Core/defined',
        '../../Core/defineProperties',
        '../../Core/DeveloperError',
        '../../Core/EasingFunction',
        '../../Scene/SceneTransforms',
        '../../ThirdParty/knockout'
    ], function(
        Cartesian2,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        EasingFunction,
        SceneTransforms,
        knockout) {
    'use strict';

    var screenSpacePos = new Cartesian2();
    var offScreen = '-1000px';

    /**
     * The view model for {@link InfoBoxLine}.
     * @alias InfoBoxLineViewModel
     * @constructor
     *
     * @param {Scene} scene The scene instance to use for screen-space coordinate conversion.
     * @param {Element} infoBoxLineElement The element containing all elements that make up the info line box.
     * @param {Element} container The DOM element that contains the widget.
     * @param {Element|String} container The DOM element or ID that will contain the element to connect to.
     */
    function InfoBoxLineViewModel(scene, infoBoxLineElement, container, connectingElement) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(scene)) {
            throw new DeveloperError('scene is required.');
        }

        if (!defined(infoBoxLineElement)) {
            throw new DeveloperError('infoBoxLineElement is required.');
        }

        if (!defined(container)) {
            throw new DeveloperError('container is required.');
        }

        if (!defined(connectingElement)) {
            throw new DeveloperError('connecting element is required.');
        }
        //>>includeEnd('debug')

        this._scene = scene;
        this._screenPositionX = offScreen;
        this._screenPositionY = offScreen;
        this._width = 0;
        this._angle = 0;
        this._tweens = scene.tweens;
        this._container = defaultValue(container, document.body);
        this._infoBoxLineElement = infoBoxLineElement;
        this._connectingElement = connectingElement;
        this._scale = 1;

        /**
         * Gets or sets the world position of the object for which to display the selection indicator.
         * @type {Cartesian3}
         */
        this.position = undefined;

        /**
         * Gets or sets the visibility of the selection indicator.
         * @type {Boolean}
         */
        this.showSelection = false;

        knockout.track(this, ['position', '_screenPositionX', '_screenPositionY', '_width', '_angle', '_scale', 'showSelection']);

        /**
         * Gets the visibility of the position indicator.  This can be false even if an
         * object is selected, when the selected object has no position.
         * @type {Boolean}
         */
        this.isVisible = undefined;
        knockout.defineProperty(this, 'isVisible', {
            get : function() {
                return this.showSelection && defined(this.position);
            }
        });

        knockout.defineProperty(this, '_transform', {
            get : function() {
                return 'scale(' + (this._scale) + ')';
            }
        });

        /**
         * Gets or sets the function for converting the world position of the object to the screen space position.
         *
         * @member
         * @type {SelectionIndicatorViewModel~ComputeScreenSpacePosition}
         * @default SceneTransforms.wgs84ToWindowCoordinates
         *
         * @example
         * selectionIndicatorViewModel.computeScreenSpacePosition = function(position, result) {
         *     return Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position, result);
         * };
         */
        this.computeScreenSpacePosition = function(position, result) {
            return SceneTransforms.wgs84ToWindowCoordinates(scene, position, result);
        };
    }

    /**
     * Updates the view of the selection indicator to match the position and content properties of the view model.
     * This function should be called as part of the render loop.
     */
    InfoBoxLineViewModel.prototype.update = function() {
        if (this.showSelection && defined(this.position)) {
            this._infoBoxLineElement.style.display = "inherit";

            var screenPosition = this.computeScreenSpacePosition(this.position, screenSpacePos);
            if (!defined(screenPosition)) {
                this._screenPositionX = offScreen;
                this._screenPositionY = offScreen;
            } else {
                this._screenPositionX = screenPosition.x + 'px';
                this._screenPositionY = screenPosition.y + 'px';

                var windowContainerOffset = getOffset(this._connectingElement);
                // bottom right
                var x1 = screenPosition.x;
                var y1 = screenPosition.y;
                // top right
                var x2 = windowContainerOffset.left + windowContainerOffset.width / 2;
                var y2 = windowContainerOffset.top + windowContainerOffset.top / 2;
                // distance
                var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
                // center
                var cx = ((x1 + x2) / 2) - (length / 2);
                var cy = ((y1 + y2) / 2) - (5 / 2);
                // angle
                var angle = 1 * Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);

                this._screenPositionX = cx + 'px';
                this._screenPositionY = cy + 'px';
                this._width = length + "px";
                this._angle = "rotate(" + angle + "deg)";
            }
        }
        else {
            if (this._infoBoxLineElement) {
                this._infoBoxLineElement.style.display = "none";
            }
        }
    };

    /**
     * Animate the indicator to draw attention to the selection.
     */
    InfoBoxLineViewModel.prototype.animateAppear = function() {
        this._tweens.addProperty({
            object : this,
            property : '_scale',
            startValue : 2,
            stopValue : 1,
            duration : 0.8,
            easingFunction : EasingFunction.EXPONENTIAL_OUT
        });
    };

    /**
     * Animate the indicator to release the selection.
     */
    InfoBoxLineViewModel.prototype.animateDepart = function() {
        this._tweens.addProperty({
            object : this,
            property : '_scale',
            startValue : this._scale,
            stopValue : 1.5,
            duration : 0.8,
            easingFunction : EasingFunction.EXPONENTIAL_OUT
        });
    };

    /* Helper */
    function getOffset( el ) {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    }

    defineProperties(InfoBoxLineViewModel.prototype, {
        /**
         * Gets the HTML element containing the info box line.
         * @memberof InfoBoxLineViewModel.prototype
         *
         * @type {Element}
         */
        container : {
            get : function() {
                return this._container;
            }
        },

        /**
         * Gets the HTML element that holds the info box line.
         * @memberof InfoBoxLineViewModel.prototype
         *
         * @type {Element}
         */
        infoBoxLineElement : {
            get : function() {
                return this._infoBoxLineElement;
            }
        },

        /**
         * Gets the HTML element that holds the connecting element.
         * @memberof InfoBoxLineViewModel.prototype
         *
         * @type {Element}
         */
        connectingElement : {
            get : function() {
                return this._connectingElement;
            }
        },

        /**
         * Gets the scene being used.
         * @memberof InfoBoxLineViewModel.prototype
         *
         * @type {Scene}
         */
        scene : {
            get : function() {
                return this._scene;
            }
        }
    });

    /**
     * A function that converts the world position of an object to a screen space position.
     * @callback InfoBoxLineViewModel~ComputeScreenSpacePosition
     * @param {Cartesian3} position The position in WGS84 (world) coordinates.
     * @param {Cartesian2} result An object to return the input position transformed to window coordinates.
     * @returns {Cartesian2} The modified result parameter.
     */

    return InfoBoxLineViewModel;
});

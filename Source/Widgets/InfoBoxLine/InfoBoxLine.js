/*global define*/
define([
        '../../Core/defined',
        '../../Core/defineProperties',
        '../../Core/destroyObject',
        '../../Core/DeveloperError',
        '../../ThirdParty/knockout',
        '../getElement',
        './InfoBoxLineViewModel'
    ], function(
        defined,
        defineProperties,
        destroyObject,
        DeveloperError,
        knockout,
        getElement,
        InfoBoxLineViewModel) {
    'use strict';

    /**
     * A widget for displaying a line between a selected object and the info box.
     *
     * @alias InfoBoxLine
     * @constructor
     *
     * @param {Element|String} container The DOM element or ID that will contain the widget.
     * @param {Element|String} container The DOM element or ID that will contain the element to connect to.
     * @param {Scene} scene The Scene instance to use.
     *
     * @exception {DeveloperError} Element with id "container" does not exist in the document.
     */
    function InfoBoxLine(container, connectingElem, scene) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(container)) {
            throw new DeveloperError('container is required.');
        }
        if (!defined(connectingElem)) {
            throw new DeveloperError('connecting container is required.');
        }
        //>>includeEnd('debug')

        container = getElement(container);
        connectingElem = getElement(connectingElem);

        this._container = container;
        this._connectingElem = connectingElem;

        var el = document.createElement('div');
        //el.className = 'cesium-infobox-line-wrapper';
        el.setAttribute('data-bind', '\
style: { "top" : _screenPositionY, "left" : _screenPositionX, "width" : _width, "-webkit-transform": _angle, "-o-transform": _angle, "transform": _angle, "MozTransform": _angle},\
css: { "cesium-infobox-line-visible" : isVisible }');

        el.style.padding = "0px";
        el.style.margin = "0px";
        el.style.height = "5px";
        el.style.backgroundColor = "#545454";
        el.style.lineHeight = "1px";
        el.style.position = "absolute";

        this._container.appendChild(el);
        this._element = el;

        var viewModel = new InfoBoxLineViewModel(scene, this._element, this._container, this._connectingElem.children[0]);
        this._viewModel = viewModel;

        knockout.applyBindings(this._viewModel, this._element);
    }

    defineProperties(InfoBoxLine.prototype, {
        /**
         * Gets the parent container.
         * @memberof InfoBoxLine.prototype
         *
         * @type {Element}
         */
        container : {
            get : function() {
                return this._container;
            }
        },

        /**
         * Gets the connecting elem container.
         * @memberof InfoBoxLine.prototype
         *
         * @type {Element}
         */
        connectingElem : {
            get : function() {
                return this._connectingElem;
            }
        },

        /**
         * Gets the view model.
         * @memberof InfoBoxLine.prototype
         *
         * @type {InfoBoxLineViewModel}
         */
        viewModel : {
            get : function() {
                return this._viewModel;
            }
        }
    });

    /**
     * @returns {Boolean} true if the object has been destroyed, false otherwise.
     */
    InfoBoxLine.prototype.isDestroyed = function() {
        return false;
    };

    /**
     * Destroys the widget.  Should be called if permanently
     * removing the widget from layout.
     */
    InfoBoxLine.prototype.destroy = function() {
        var container = this._container;
        knockout.cleanNode(this._element);
        container.removeChild(this._element);
        return destroyObject(this);
    };

    return InfoBoxLine;
});

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

        /*
        var el = document.createElement('div');
        el.className = 'cesium-infobox-line-wrapper';
        el.setAttribute('data-bind', '\
style: { "top" : _screenPositionY, "left" : _screenPositionX },\
css: { "cesium-infobox-line-visible" : isVisible }');
        container.appendChild(el);
        this._element = el;

        var svgNS = 'http://www.w3.org/2000/svg';
        var path = 'M -34 -34 L -34 -11.25 L -30 -15.25 L -30 -30 L -15.25 -30 L -11.25 -34 L -34 -34 z M 11.25 -34 L 15.25 -30 L 30 -30 L 30 -15.25 L 34 -11.25 L 34 -34 L 11.25 -34 z M -34 11.25 L -34 34 L -11.25 34 L -15.25 30 L -30 30 L -30 15.25 L -34 11.25 z M 34 11.25 L 30 15.25 L 30 30 L 15.25 30 L 11.25 34 L 34 34 L 34 11.25 z';

        var svg = document.createElementNS(svgNS, 'svg:svg');
        svg.setAttribute('width', 160);
        svg.setAttribute('height', 160);
        svg.setAttribute('viewBox', '0 0 160 160');

        var group = document.createElementNS(svgNS, 'g');
        group.setAttribute('transform', 'translate(80,80)');
        svg.appendChild(group);

        var pathElement = document.createElementNS(svgNS, 'path');
        pathElement.setAttribute('data-bind', 'attr: { transform: _transform }');
        pathElement.setAttribute('d', path);
        group.appendChild(pathElement);

        el.appendChild(svg);
        */

        /*
        var el = document.createElement('div');
        el.className = 'cesium-infobox-line-wrapper';
        el.setAttribute('data-bind', '\
            style: { "top" : _screenPositionY, "left" : _screenPositionX },\
            css: { "cesium-infobox-line-visible" : isVisible }');
        container.appendChild(el);
        this._element = el;
        var aSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        aLine.setAttribute('x1', 6);
        aLine.setAttribute('y1', 100);
        aLine.setAttribute('x2', 100);
        aLine.setAttribute('y2', 200);
        aLine.setAttribute('stroke', "#ff0000");
        aLine.setAttribute('stroke-width', "4");
        aSvg.appendChild(aLine);
        el.appendChild(aSvg);
        */


        var el = document.createElement('div');
        //el.className = 'cesium-infobox-line-wrapper';
        el.setAttribute('data-bind', '\
style: { "top" : _screenPositionY, "left" : _screenPositionX, "width" : _width, "-webkit-transform": _angle, "-o-transform": _angle, "transform": _angle, "MozTransform": _angle},\
css: { "cesium-infobox-line-visible" : isVisible }');

        el.style.padding = "0px";
        el.style.margin = "0px";
        el.style.height = "5px";
        el.style.backgroundColor = "#ff0000";
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

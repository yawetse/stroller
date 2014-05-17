/*
 * slimscroll
 * http://github.com/yawetse/stroller
 *
 * Copyright (c) 2014 Yaw Joseph Etse. All rights reserved.
 */
'use strict';

var classie = require('classie'),
	extend = require('util-extend'),
	domhelper = require('domhelper');

/**
 * CSS3 list scroll effects, inspired by: http://lab.hakim.se/scroll-effects
 * @{@link https://github.com/yawetse/stroller}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Yaw Joseph Etse. All rights reserved.
 * @license MIT
 * @module stroller
 * @requires module:classie
 * @requires module:util-extent
 * @requires module:util
 * @requires module:events
 * @todo need to switch to node events
 */
var stroller = function(options){
	var effects = {
			cards:'stroller-effect-cards',
			grow:'stroller-effect-grow',
			flip:'stroller-effect-flip',
			fly:'stroller-effect-fly',
			'fly-simplified':'stroller-effect-fly-simplified',
			'fly-reverse':'stroller-effect-fly-reverse',
			skew:'stroller-effect-skew',
			helix:'stroller-effect-helix',
			wave:'stroller-effect-wave',
			fan:'stroller-effect-fan',
			tilt:'stroller-effect-tilt',
			curl:'stroller-effect-curl',
			papercut:'stroller-effect-papercut',
			zipper:'stroller-effect-zipper',
			fade:'stroller-effect-fade',
			twirl:'stroller-effect-twirl',
		},
		defaults = {
			strollerContainerQuerySelector: '.strollerContainer',
			strollerItemQuerySelector:'stroller',
			strollerWrapperClass:'stroller-wrapper',
			fullscreen:false,
			effect:effects.flip
		},
		o = extend( defaults,options ),
		elements = document.querySelectorAll(options.strollerContainerQuerySelector);
	/**
	 * set the stroller effect
	 * @param {string} neweffect - string of new effect
	 * @param {object} element - html element of stroller
	 */
	this.setStrollerEffect = function(neweffect,element){
		var currentStroller;
		if(element){
			classie.removeClass(element,o.effect);
			classie.addClass(element,neweffect);
		}
		else{
			for(var x=0;x<elements.length;x++){
				currentStroller = elements[x];
				classie.removeClass(currentStroller,o.effect);
				classie.addClass(currentStroller,neweffect);
			}
		}
		o.effect = neweffect;
	};

	/**
	 * get all effect options
	 */
	this.getEffects = function(){
		return effects;
	};

	/**
	 * create stroller elements
	 */
	this.init = function(){
		var currentStroller,currentStrollerItemsArray,currentStrollerItem;
		for(var x = 0; x <elements.length; x++){
			currentStroller = elements[x];
			this.setStrollerEffect(o.effect,currentStroller);

			currentStrollerItemsArray = currentStroller.querySelectorAll(o.strollerItemQuerySelector);
			for(var y = 0; y <currentStrollerItemsArray.length; y++){
				currentStrollerItem = currentStrollerItemsArray[y];
				classie.addClass(currentStrollerItem,'stroller-element');
			}
			var wrapperElement = document.createElement("div");
			wrapperElement.setAttribute("class",o.strollerWrapperClass);
			domhelper.elementWrap(currentStroller,wrapperElement);

			currentStroller.addEventListener('scroll',strollerScrollEventHandler);

		}
	}.bind(this);

	this.init();

	var _setFutureAndPastClass = function(element){
		var currentStroller = element,
			strollerParent = currentStroller.parentNode,
			strollerParentPosition = domhelper.getPosition(strollerParent),
			strollerChildren = currentStroller.querySelectorAll('.stroller-element'),
			strollerElement;

		for(var x=0;x<strollerChildren.length;x++){
			strollerElement = strollerChildren[x];
			if(strollerParentPosition.top > (strollerElement.getBoundingClientRect().bottom) ){
				classie.addClass( strollerElement , 'past');
			}
			else if(o.fullscreen && (0>strollerElement.getBoundingClientRect().bottom)){
				classie.addClass( strollerElement , 'past');
			}
			else if(strollerParent.getBoundingClientRect().bottom < (strollerElement.getBoundingClientRect().top ) ){
				classie.addClass( strollerElement , 'future');
			}
			else if( o.fullscreen && ( window.innerHeight < strollerElement.getBoundingClientRect().top ) ){
				classie.addClass( strollerElement , 'future');
			}
			else{
				classie.removeClass( strollerElement , 'past');
				classie.removeClass( strollerElement , 'future');
			}
		}
	};

	function strollerScrollEventHandler(e){
		_setFutureAndPastClass(e.target);
	}

	/**
	 * update classes for stroller
	 */
	this.setFutureAndPastClass = _setFutureAndPastClass;

	for(var x = 0; x <elements.length; x++){
		this.setFutureAndPastClass(elements[x]);
	}
};

module.exports = stroller;

// If there is a window object, that at least has a document property,
// define linotype
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.stroller = stroller;
}
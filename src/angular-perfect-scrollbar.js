(function () {
	"use strict";

	// Check we have PerfectScrollbar
	if (typeof PerfectScrollbar === undefined) {
		throw "PerfectScrollbar plugin required, please include the relevant JS files. Get PerfectScrollbar with: bower install perfect-scrollbar";
	}

	angular.module("directives.perfectScrollbar", []).directive("perfectScrollbar", ["$window", "$timeout",
		function ($window, $timeout) {
			var perfectScrollbarOptions = [
				"wheelSpeed",
				"wheelPropagation",
				"swipePropagation",
				"minScrollbarLength",
				"maxScrollbarLength",
				"useBothWheelAxes",
				"useKeyboard",
				"suppressScrollX",
				"suppressScrollY",
				"scrollXMarginOffset",
				"scrollYMarginOffset"
			];
			var directiveOptions = [
				"disabled"
			];
			return {
				restrict: "EA",
				link: function (scope, $elem, $attrs) {
					var elem = $elem[0];
					var jlWindow = angular.element($window);
					var psOptions = evaluteOptions(perfectScrollbarOptions, $attrs);
					var dirOptions = evaluteOptions(directiveOptions, $attrs);

					if (dirOptions.disabled)
						return;

					var isPsInited = false;
					$timeout(initializePerfectScrollbar, 5, false);

					function initializePerfectScrollbar() {
						scope.$evalAsync(function () {
							PerfectScrollbar.initialize(elem, psOptions);
							isPsInited = true;
						});
					}

					$attrs.psDisabled && scope.$watch($attrs.psDisabled, disable);
					$attrs.psUpdate && scope.$watch($attrs.psUpdate, update);

					scope.$on("psUpdateTrigger", update);
					jlWindow.on("resize", update);

					function update() {
						if (isPsInited)
							scope.$evalAsync(function () {
								PerfectScrollbar.update(elem, psOptions);
							});
					}
					
					function disable() {
						jlWindow.off("resize", update);
						PerfectScrollbar.destroy(elem);
					}

					scope.$on("$destroy", disable);

					function evaluteOptions(matchOptions, $attrs) {
						var parsedOpts = {};
						for (var i = 0, l = matchOptions.length; i < l; i++) {
							var opt = matchOptions[i];
							var attrOpt = Object.keys($attrs).filter(function (attr) {
								return attr.toLowerCase().indexOf(opt.toLowerCase()) > -1;
							})[0];
							if (attrOpt)
								parsedOpts[opt] = scope.$eval($attrs[attrOpt]);
						}
						return parsedOpts;
					}
				}

			};
			
		
		}
	]);
})();
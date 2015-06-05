(function() {
	"use strict";

	// Check we have PerfectScrollbar
	if (typeof PerfectScrollbar === undefined) {
		throw "PerfectScrollbar plugin required, please include the relevant JS files. Get PerfectScrollbar with: bower install perfect-scrollbar";
	}

	angular.module("directives.perfectScrollbar", []).directive("perfectScrollbar",
	[
		"$parse", "$window", function($parse, $window) {
			var psOptions = [
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

			return {
				restrict: "EA",
				link: function ($scope, $elem, $attr) {
					var elem = $elem[0];
					var jqWindow = angular.element($window);
					var options = {};
					
					for (var i = 0, l = psOptions.length; i < l; i++) {
						var opt = psOptions[i];
						var attrOpt = Object.keys($attr).filter(function(attr) {
							return attr.toLowerCase().indexOf(opt.toLowerCase()) > -1;
						})[0];
						if (attrOpt)
							options[opt] = $parse($attr[attrOpt])();
						
					}

					var isPsInit = false;
					setTimeout(psInit, 5);
					function psInit() {
						$scope.$evalAsync(function () {
							PerfectScrollbar.initialize(elem, options);
							isPsInit = true;
						});
					}

					$scope.$watch($attr.psUpdate, update);
					function update() {
						if (isPsInit)
							$scope.$evalAsync(function () {
								PerfectScrollbar.update(elem, options);
							});
					}

					$elem.bind("$destroy", function() {
						jqWindow.off("resize", update);
						PerfectScrollbar.destroy(elem);
					});
				}
			};
		}
	]);
})();
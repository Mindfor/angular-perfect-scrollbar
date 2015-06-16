(function () {
	"use strict";

	// Check we have PerfectScrollbar
	if (typeof PerfectScrollbar === undefined) {
		throw "PerfectScrollbar plugin required, please include the relevant JS files. Get PerfectScrollbar with: bower install perfect-scrollbar";
	}

	angular.module("directives.perfectScrollbar", []).directive("perfectScrollbar",
	[
		"$parse", "$window", "$timeout", function ($parse, $window, $timeout) {
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
						var attrOpt = Object.keys($attr).filter(function (attr) { return attr.toLowerCase().indexOf(opt.toLowerCase()) > -1;})[0];
						if (attrOpt)
							options[opt] = $parse($attr[attrOpt])();
					}

					var isPsInit = false;
					$timeout(psInit, 5, false);
					function psInit() {
						$scope.$evalAsync(function () {
							PerfectScrollbar.initialize(elem, options);
							isPsInit = true;
						});
					}

					setWatcherOnPsUpdate();
					function setWatcherOnPsUpdate() {
						var evaledUpdateExp = $scope.$eval($attr.psUpdate);
						if (angular.isFunction(evaledUpdateExp))
							return;
						$scope.$watch($attr.psUpdate, update);
					}
					function update() {
						if (isPsInit)
							$scope.$evalAsync(function () {
								PerfectScrollbar.update(elem, options);
							});
					}

					$scope.$on("psUpdateTrigger", update);
					jqWindow.on("resize", update);

					$elem.bind("$destroy", function () {
						jqWindow.off("resize", update);
						PerfectScrollbar.destroy(elem);
					});
				}
			};
		}
	]);
})();
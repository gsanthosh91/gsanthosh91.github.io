var app = angular.module('cpApp', []);

	app.controller('issMapsController',function($scope, $location, $window, $http) {
		var map;
		var gmarkers = [];
		var marker;
		$scope.currentInfo = 0;
		var infowindow = new google.maps.InfoWindow();
		
		$scope.moveISS = function() {$.getJSON('http://data.flightradar24.com/zones/fcgi/feed.js?bounds='+$scope.val2+','+$scope.val1+','+$scope.val4+','+$scope.val3+'&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=900&gliders=1&stats=1&selected=full_all.json&&filter_info=1',function(data) {
			delete data['full_count'];
			delete data['version'];
			delete data['stats'];
			delete data['visible'];
			delete data['selected-matched:'];
			
			
			$scope.removeMarkers();
			if ($scope.currentInfo != 0) {
				infowindow.open(map,
						$scope.currentInfo);
			}

			for (x in data) {
				marker = new google.maps.Marker({
							icon: {
								path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
								strokeColor: 'blue',
							    scale: 2,
							    rotation: data[x][3]
							  },
							position : new google.maps.LatLng(data[x][1],data[x][2]),
							map : map
				});

				gmarkers.push(marker);
				google.maps.event.addListener(marker,'click',(function(marker,x) {
									return function() {
										$scope.currentInfo = marker;
										infowindow.setContent(data[x][16]);
										$scope.details=data[x];
										$scope.$apply();
										infowindow.open(map,marker);
									}
				})(marker,x));
				
			}

			setTimeout($scope.moveISS, 2000);

		});
		};
		
		
		$scope.removeMarkers = function() {
			for (i = 0; i < gmarkers.length; i++) {
				gmarkers[i].setMap(null);
			}
		}

	function initializeMap() {

		var mapOptions = {
			zoom : 8,
			center : new google.maps.LatLng(13.9117, 79.9580),
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);
		
		google.maps.event.addListener(map, 'bounds_changed', function() {
            var bounds =  map.getBounds();
            $scope.val1=bounds.N.N;
            $scope.val2=bounds.N.j;
            $scope.val3=bounds.j.N;
            $scope.val4=bounds.j.j;
   		});
		$scope.moveISS();
	}
	
	google.maps.event.addDomListener(window, 'load', initializeMap);
	
	
	});

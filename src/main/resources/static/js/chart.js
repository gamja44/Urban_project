$(document).ready(function () {
    // 카카오 지도 설정
    var mapContainer = document.getElementById('map'),
        mapOption = {
            center: new kakao.maps.LatLng(37.478568, 126.864732),
            level: 6
        };

    var map = new kakao.maps.Map(mapContainer, mapOption);
    var clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 5
    });

    // 아파트 데이터를 가져와서 지도에 표시
	let deals =  Array.from({length: 12}, () => 0);
	let cntMonth = Array.from({length: 12}, () => 0);
	
    $.ajax({
        url: '/apartments/json', // 아파트 데이터 API URL
        method: 'GET',
        success: function (data) {
            var markers = [];
            data.forEach(function (apartment) {
				deals[apartment.referenceMonth-1] += apartment.dealAmount;
				cntMonth[apartment.referenceMonth-1]++;
                if (apartment.ycoordinate && apartment.xcoordinate) {
                    var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(apartment.ycoordinate, apartment.xcoordinate),
                        title: apartment.apartmentName
                    });

                    // 마커 클릭 이벤트: URL에 chart 파라미터 추가
                    kakao.maps.event.addListener(marker, 'click', function () {
                        window.location.href = '/chart?apartment=' + encodeURIComponent(apartment.apartmentName) + 
                                               '&amount=' + encodeURIComponent(apartment.dealAmount);
                    });

                    markers.push(marker);
                }
            });
            clusterer.addMarkers(markers);
        },
        error: function () {
            console.error('아파트 데이터를 불러오는 데 실패했습니다.');
        }
    });

    // 모달이 열릴 때 차트 생성
    $('#aptModal').on('shown.bs.modal', function () {
    	createChart();  // 차트 생성
    });

    // 차트 생성 함수
    function createChart() {
/*        // 기존 차트가 존재하면 제거
        if (window.myChart) {
            window.myChart.destroy();
        }*/
		for(let i = 0 ; i < 12; i++){
			if(cntMonth[i] != 0) deals[i] /= cntMonth[i];
		}
		
		let labels = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
		let dealAmounts = deals;
		console.log(labels);
		console.log(dealAmounts);
		
        var ctx = document.getElementById('myChart').getContext('2d');
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '거래 금액 (만원)',
                    data: dealAmounts,
                    backgroundColor: ['rgba(100, 0, 0, 0.2)', 
									  'rgba(255, 99, 132, 0.2)',
									  'rgba(255, 159, 64, 0.2)',
									  'rgba(255, 205, 86, 0.2)',
									  'rgba(75, 192, 192, 0.2)',
									  'rgba(54, 162, 235, 0.2)',
									  'rgba(153, 102, 255, 0.2)',
									  'rgba(201, 203, 207, 0.2)',
									  'rgba(0, 0, 100, 0.2)',
									  'rgba(0, 0, 150, 0.3)',
									  'rgba(0, 0, 200, 0.4)',
									  'rgba(0, 0, 250, 0.5)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: '거래 금액 (만원)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '아파트명'
                        }
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });
    }

    // 페이지 로드 시 "chart" 파라미터가 있으면 모달 열기
    if (new URLSearchParams(window.location.search).get('apartment')) {
        var aptModal = new bootstrap.Modal(document.getElementById('aptModal'));
        aptModal.show();
    }
});

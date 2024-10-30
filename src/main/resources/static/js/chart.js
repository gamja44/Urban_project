$(document).ready(function () {
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
    $.ajax({
        url: '/apartments/json',
        method: 'GET',
        success: function (data) {
            var markers = [];
            data.forEach(function (apartment) {
                if (apartment.ycoordinate && apartment.xcoordinate) {
                    var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(apartment.ycoordinate, apartment.xcoordinate),
                        title: apartment.apartmentName
                    });

                    // 마커 클릭 이벤트 등록
                    kakao.maps.event.addListener(marker, 'click', function () {
                        // 거래 금액 데이터 수집
                        var labels = [];
                        var dealAmounts = [];

                        labels.push(apartment.apartmentName); // 아파트 이름 추가
                        dealAmounts.push(apartment.dealAmount); // 거래 금액 추가

                        // 차트 생성
                        createChart(labels, dealAmounts);

                        // 모달 창 띄우기
                        var apartmentModal = new bootstrap.Modal(document.getElementById('apartmentModal'));
                        apartmentModal.show();
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

    // 차트 생성 함수
    function createChart(labels, dealAmounts) {
        // 기존 차트가 존재하면 제거
        if (window.myChart) {
            window.myChart.destroy();
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        window.myChart = new Chart(ctx, {
            type: 'bar', // 차트 타입
            data: {
                labels: labels,
                datasets: [{
                    label: '거래 금액 (만원)',
                    data: dealAmounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
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
});

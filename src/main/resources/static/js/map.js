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
                        // 모달 창에 정보 업데이트
                        $('#apartmentLabel').text(apartment.apartmentName);
						var detailsHtml = `
						    <tr><th>년도</th><td>${apartment.year}</td></tr>
						    <tr><th>거래 금액</th><td>${apartment.dealAmount}</td></tr>
						    <tr><th>법정동 명</th><td>${apartment.legalDongName}</td></tr>
						    <tr><th>층수</th><td>${apartment.floor}</td></tr>
						    <tr><th>번지</th><td>${apartment.lotNumber}</td></tr>
						    <tr><th>아파트명</th><td>${apartment.apartmentName}</td></tr>
						    <tr><th>건축년도</th><td>${apartment.buildYear}</td></tr>
						    <tr><th>기준일</th><td>${apartment.referenceDay}</td></tr>
						    <tr><th>기준월</th><td>${apartment.referenceMonth}</td></tr>
						    <tr><th>전용면적</th><td>${apartment.exclusiveArea}㎡</td></tr>
						`;
						var detailsHtml2 = `<tr><th>전용면적</th><td>${apartment.exclusiveArea}㎡</td></tr>`;
						$('#apartment-details').html(detailsHtml);
						$('#apartment-details2').html(detailsHtml2);


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
});


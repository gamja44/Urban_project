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

    var allApartmentData = []; // 초기 로드된 데이터를 저장하는 전역 변수

    // 아파트 데이터를 가져와서 지도에 표시 (기존 코드 유지)
    $.ajax({
        url: '/apartments/json',
        method: 'GET',
        success: function (data) {
            allApartmentData = data; // 데이터를 전역 변수에 저장
            updateMapWithMarkers(allApartmentData); // 지도에 초기 데이터를 표시
        },
        error: function () {
            console.error('아파트 데이터를 불러오는 데 실패했습니다.');
        }
    });

    // 필터링 함수 정의 (버튼 클릭과 Enter 키 이벤트에서 재사용)
    function filterAndUpdateMap() {
        var minPrice = $('#min-price').val();
        var maxPrice = $('#max-price').val();
        var minArea = $('#min-area').val();
        var maxArea = $('#max-area').val();
        var legalDong = $('#legal-dong').val();

        // 전역 변수에서 필터링
        var filteredData = allApartmentData.filter(function (apartment) {
            return (!minPrice || apartment.dealAmount >= minPrice) &&
                   (!maxPrice || apartment.dealAmount <= maxPrice) &&
                   (!minArea || apartment.exclusiveArea >= minArea) &&
                   (!maxArea || apartment.exclusiveArea <= maxArea) &&
                   (!legalDong || apartment.legalDongName.includes(legalDong));
        });

        clusterer.clear();  // 기존 마커 제거
        updateMapWithMarkers(filteredData);  // 필터링된 데이터로 지도 업데이트
    }

    // 필터 버튼 클릭 시 필터링된 데이터를 지도에 표시
    $('#filter-button').on('click', filterAndUpdateMap);

    // 필터 입력 필드에서 Enter 키 입력 시 필터링
    $('.form-control').on('keypress', function (e) {
        if (e.which === 13) { // Enter 키를 눌렀을 때
            filterAndUpdateMap();
        }
    });

    // 데이터를 받아 마커를 지도에 표시하는 함수
    function updateMapWithMarkers(data) {
        var markers = [];
        data.forEach(function (apartment) {
            if (apartment.ycoordinate && apartment.xcoordinate) {
                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(apartment.ycoordinate, apartment.xcoordinate),
                    title: apartment.apartmentName
                });

                // 마커 클릭 이벤트 등록 (모달 창 띄우기)
                kakao.maps.event.addListener(marker, 'click', function () {
                    $('#apartmentModalLabel').text(apartment.apartmentName);
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
                    $('#apartment-details').html(detailsHtml);

                    var apartmentModal = new bootstrap.Modal(document.getElementById('apartmentModal'));
                    apartmentModal.show();
                });

                markers.push(marker);
            }
        });
        clusterer.addMarkers(markers);  // 클러스터링에 마커 추가
    }
	
	// 메인 네비게이션에서 검색 버튼 클릭 이벤트 리스너 추가
	    $('#search-button').on('click', function () {
	        performSearch();
	    });

	    // 메인 네비게이션의 검색 입력 필드에서 Enter 키 입력 시 검색 수행
	    $('#search-input').on('keypress', function (e) {
	        if (e.which === 13) {
	            e.preventDefault(); // Enter 키로 폼 제출 방지
	            performSearch();
	        }
	    });

	    // 메인 네비게이션 검색 수행 함수
	    function performSearch() {
	        var searchTerm = $('#search-input').val().toLowerCase();

	        // 검색어가 포함된 데이터 필터링
	        var filteredData = allApartmentData.filter(function (apartment) {
	            return apartment.apartmentName.toLowerCase().includes(searchTerm) ||
	                   apartment.legalDongName.toLowerCase().includes(searchTerm) ||
	                   apartment.dealAmount.toString().includes(searchTerm) ||
	                   apartment.floor.toString().includes(searchTerm);
	        });

	        clusterer.clear();  // 기존 마커 제거
	        updateMapWithMarkers(filteredData);  // 필터링된 데이터로 지도 업데이트
	    }
});

package com.gudee.urban.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gudee.urban.dao.ApartmentDataMapper;
import com.gudee.urban.dto.ApartmentData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ApartmentService {

    private final ApartmentDataMapper apartmentDataMapper;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    ApartmentService(ApartmentDataMapper apartmentDataMapper, RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.apartmentDataMapper = apartmentDataMapper;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // 주기적인 데이터 업데이트 설정 (매일 자정)
    @Scheduled(cron = "0 0 0 1 * ?")  // 매월 자정(00:00)에 실행
    public void fetchAndSaveRealEstateDataDaily() {
        fetchAndSaveRealEstateData();
    }
    
    public List<ApartmentData> findAll() {
        return apartmentDataMapper.findAll();
    }
    
    public List<ApartmentData> findFilteredApartments(Integer minPrice, Integer maxPrice, Double minArea, Double maxArea, String sort) {
        Map<String, Object> params = new HashMap<>();
        params.put("minPrice", minPrice);
        params.put("maxPrice", maxPrice);
        params.put("minArea", minArea);
        params.put("maxArea", maxArea);
        params.put("sort", sort);

        return apartmentDataMapper.findFiltered(params);
    }

    public void fetchAndSaveRealEstateData() {
        int pIndex = 1;
        for (; pIndex <= 250; pIndex++) {
            String apiUrl = "https://data.gm.go.kr/openapi/Apttradedelngdetail?KEY=c7b5ec2d3cae44c0a073520eb418bd13&Type=json&pIndex=" + pIndex + "&pSize=100";

            try {
                String responseData = restTemplate.getForObject(apiUrl, String.class);
                if (responseData != null) {
                    Map<String, Object> map = objectMapper.readValue(responseData, Map.class);
                    List<Map<String, Object>> list = (List<Map<String, Object>>) map.get("Apttradedelngdetail");
                    Map<String, Object> rowMap = (Map<String, Object>) list.get(1);
                    List<Map<String, Object>> row = (List<Map<String, Object>>) rowMap.get("row");

                    for (Map<String, Object> tmp : row) {
                        ApartmentData apt = new ApartmentData();
                        apt.setYear((String) tmp.get("YY"));
                        apt.setDealAmount(Integer.parseInt(tmp.get("DELNG_AMT").toString()));
                        apt.setLegalDongName((String) tmp.get("LEGALDONG_NM"));
                        apt.setFloor(Integer.parseInt(tmp.get("FLOOR_CNT").toString()));
                        apt.setLotNumber((String) tmp.get("LOTNO"));
                        apt.setApartmentName((String) tmp.get("APT_NM"));
                        apt.setBuildYear((String) tmp.get("BUILD_YY"));
                        apt.setReferenceDay((String) tmp.get("DE"));
                        apt.setReferenceMonth((String) tmp.get("MT"));
                        apt.setExclusiveArea(Double.parseDouble(tmp.get("PRVTUSE_AR").toString()));

                        // Kakao API를 사용하여 주소로부터 좌표(x, y) 가져오기
                        fetchCoordinatesFromAddress(apt);

                        // 유효성 검증 후 데이터베이스에 데이터 저장
                        if (isValid(apt) && apartmentDataMapper.countExistingData(apt) == 0) {
                            apartmentDataMapper.insertApartmentData(apt);
                        }
                    }
                    System.out.println("Page " + pIndex + " processed.");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void fetchCoordinatesFromAddress(ApartmentData apt) {
        try {
            // Kakao API URL 구성
            String address = apt.getLegalDongName() + " " + apt.getLotNumber();
            String kakaoApiUrl = "https://dapi.kakao.com/v2/local/search/address.json?query=" + address;

            // 헤더에 인증키 추가
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK e5bd994a6dbf9414454fb691e7d6c73f");

            // 요청 엔티티 생성
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // RestTemplate을 사용하여 API 호출
            ResponseEntity<String> response = restTemplate.exchange(kakaoApiUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // 응답 데이터 파싱
                String responseBody = response.getBody();
                Map<String, Object> kakaoResult = objectMapper.readValue(responseBody, Map.class);
                List<Map<String, Object>> documents = (List<Map<String, Object>>) kakaoResult.get("documents");

                if (!documents.isEmpty()) {
                    Map<String, Object> location = documents.get(0);
                    apt.setXCoordinate(Double.parseDouble((String) location.get("x")));
                    apt.setYCoordinate(Double.parseDouble((String) location.get("y")));
                }
            } else {
                System.out.println("API 호출 실패 또는 결과 없음.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // DTO 유효성 검증 메서드
    private boolean isValid(ApartmentData dto) {
        return dto.getDealAmount() > 0 &&
                dto.getLegalDongName() != null && !dto.getLegalDongName().isEmpty() &&
                dto.getApartmentName() != null && !dto.getApartmentName().isEmpty();
    }
    // 특정 아파트의 가격 히스토리 조회
    public List<ApartmentData> getPriceHistory(String apartmentName) {
        return apartmentDataMapper.findPriceHistoryByApartmentName(apartmentName);
    }

}


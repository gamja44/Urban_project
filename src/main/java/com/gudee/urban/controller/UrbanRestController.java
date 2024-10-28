package com.gudee.urban.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
public class UrbanRestController {
    private final ObjectMapper objectMapper;

    // TODO #1 생성자 주입
    @Autowired
    public UrbanRestController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    // 2가지 return type : ResponseEntity<Class>, 단독 Class
    // ResponseEntity : HTTP 상태 코드, HTTP 헤더, 응답 본문 등을 커스텀 할 수 있음
    // 단독 Class : 리턴되는 value 를 직렬화(serialize)하여 HTTP 응답 본문으로 전송
    // produces : 서버의 응답 타입(Accept)을 지정
    // consumes : 서버의 요청 타입(Content-Type)을 지정
    @GetMapping(value = "/hello", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> hello() {

        // LocalDateTime JDK 8 이후로 추가된 날짜 시간 API
        // 더이상 Date 클래스를 사용하지 않고 LocalDateTime을 사용
        // 전통적인 방법으로 Date Class 와 SimpleDateFormat Class 를 사용하는 것보다 훨씬 간단하고 편리하게 사용 가능
        var dateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // var : JDK 10 이후로 추가된 기능, 타입 추론
        // 변수에 assign 되는 값에 따라 변수의 타입을 추론하여 자동으로 할당
        // Map.ofEntries() : JDK 9 이후로 추가된 기능, 불변 Map 생성 (개수 제한 없음)
        // Map.of() : 최대 10개의 key-value 쌍을 가지는 불변 Map 생성
        var resultMap = Map.ofEntries(
                Map.entry("message", "Hello, Urban!"),
                Map.entry("time", dateTime)
        );

        return ResponseEntity.ok(resultMap);
    }

    @RequestMapping(value = "/hi", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String hi() throws JsonProcessingException {
        Map<String, Object> resultMap = Map.ofEntries(
                Map.entry("message", "Hi, Urban!"),
                Map.entry("time", LocalDateTime.now())
        );

        // TODO #2 "this" 키워드
        return this.objectMapper.writeValueAsString(resultMap);
    }
}

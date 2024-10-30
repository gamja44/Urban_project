package com.gudee.urban.controller;

import com.gudee.urban.dto.ApartmentData;
import com.gudee.urban.service.ApartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/apartments")
public class ApartmentController {

    private final ApartmentService apartmentService;

    @Autowired
    public ApartmentController(ApartmentService apartmentService) {
        this.apartmentService = apartmentService;
    }

    // 아파트 데이터 리스트 조회
    @GetMapping
    public String getAllApartments(Model model) {
        List<ApartmentData> apartments = apartmentService.findAll();
        model.addAttribute("apartments", apartments);
        return "apartments";  // apartments.html 페이지로 데이터 전달
    }

    // 아파트 데이터를 JSON 형식으로 반환
    @GetMapping("/json")
    @ResponseBody
    public List<ApartmentData> getAllApartmentsJson() {
        return apartmentService.findAll();
    }
    
    // 특정 아파트의 가격 히스토리를 JSON으로 반환
    @GetMapping("/{apartmentName}/price-history")
    @ResponseBody
    public List<ApartmentData> getPriceHistory(@PathVariable String apartmentName) {
        return apartmentService.getPriceHistory(apartmentName);
    }
}

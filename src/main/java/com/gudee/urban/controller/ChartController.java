package com.gudee.urban.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.gudee.urban.dao.ApartmentDataMapper;
import com.gudee.urban.dto.ApartmentData;

@Controller
public class ChartController {
    @Autowired
    private ApartmentDataMapper apartmentDataMapper;

    @GetMapping("/chart")
    public String getChartData(Model model) {
        List<ApartmentData> apartmentDataList = apartmentDataMapper.findAll();
        model.addAttribute("apartmentData", apartmentDataList);
        return "chart"; // chart.html로 이동
    }
}
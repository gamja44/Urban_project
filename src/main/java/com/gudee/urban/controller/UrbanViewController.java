package com.gudee.urban.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class UrbanViewController {

    @GetMapping(value = {"/", "/index"})
    public ModelAndView index() {
        var modelAndView = new ModelAndView();
        modelAndView.setViewName("index");
        modelAndView.addObject("message", "Hello, Urban!");
        return modelAndView;
    }
}

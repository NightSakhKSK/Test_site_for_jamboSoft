package com.example.test_for_job.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/")
@Controller
public class MainController {

    @GetMapping
    public String mainPage() {
        return "redirect:/InteriorSite";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
    @GetMapping("admin")
    public String adminPage() {
        return "admin";
    }

    @GetMapping("user")
    public String userPage() {
        return "user";
    }

    @GetMapping("/InteriorSite")
    public String InteriorPage() {
        return "InteriorSite";
    }

}


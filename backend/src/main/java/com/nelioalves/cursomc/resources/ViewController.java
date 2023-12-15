package com.nelioalves.cursomc.resources;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {
    @GetMapping(value = "/{path:[^\\.]*}")
    public String forward() {
        System.out.println("chegou");
        return "forward:/";
    }
}

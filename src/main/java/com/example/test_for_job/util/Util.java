package com.example.test_for_job.util;

import com.example.test_for_job.model.Role;
import com.example.test_for_job.model.User;
import com.example.test_for_job.service.RoleService;
import com.example.test_for_job.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
public class Util implements CommandLineRunner {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public Util(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @Transactional
    @Override
    public void run(String... args) {
        Role ROLE_USER = new Role("ROLE_USER");
        roleService.addRole(ROLE_USER);
        Role ROLE_ADMIN = new Role("ROLE_ADMIN");
        roleService.addRole(ROLE_ADMIN);

        User user = new User();
        user.setName("User");
        user.setLastName("User");
        user.setUsername("user");
        user.setUserPassword("user"); //user $2a$12$7tpF2m2ptr7STdTQzjrW6emqpOoxqo.jpuXzS0KdwXrs6XaAOUFrW
        user.setRoles(new HashSet<>(List.of(ROLE_USER)));
        userService.addUser(user);

        User admin = new User();
        admin.setName("Admin");
        admin.setLastName("Admin");
        admin.setUsername("admin");
        admin.setUserPassword("admin"); //admin $2a$12$hx6glQx90Iks7yFrLf83au3CM.0uFidNxPxf246HjBe8/EKggM3oy
        admin.setRoles(new HashSet<>(Arrays.asList(ROLE_USER, ROLE_ADMIN)));
        userService.addUser(admin);
    }
}

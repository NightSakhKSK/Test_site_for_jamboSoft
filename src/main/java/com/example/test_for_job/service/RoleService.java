package com.example.test_for_job.service;

import com.example.test_for_job.model.Role;

import java.util.List;

public interface RoleService {
    void addRole(Role role);
    List<Role> getAllRoles();
}

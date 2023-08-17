package com.example.test_for_job.repository;

import com.example.test_for_job.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RoleRepository extends JpaRepository<Role, Long> {
}

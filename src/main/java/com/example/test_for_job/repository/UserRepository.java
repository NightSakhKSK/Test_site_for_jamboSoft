package com.example.test_for_job.repository;


import com.example.test_for_job.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserRepository extends JpaRepository<User, Long> {
    @Query("select distinct u from User u join fetch u.roles where u.username = :username")
    User findByUsername(@Param("username") String username);
}

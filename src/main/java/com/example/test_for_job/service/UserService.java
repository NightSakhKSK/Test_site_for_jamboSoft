package com.example.test_for_job.service;



import com.example.test_for_job.model.User;

import java.util.List;

public interface UserService {

    void addUser(User user);

    void removeUser(Long id);

    void updateUser(User user);

    List<User> allUsers();

    User getUserById(Long id);

    User getUserByUsername(String username);

}

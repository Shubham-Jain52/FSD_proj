package com.capstone.backend.service;

import com.capstone.backend.dto.UserDto;
import java.util.List;

public interface UserService {
    List<UserDto> getPatients();
}

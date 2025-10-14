package com.example.ExpMang.service;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

@Service
public class IdGenerator {

    public String generateCustomNanoId() {
        SecureRandom random = new SecureRandom();
        char[] alphabet = "0123456789".toCharArray();
        int size = 10;

        return NanoIdUtils.randomNanoId(random, alphabet, size);
    }
}

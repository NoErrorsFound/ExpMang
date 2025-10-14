package com.example.ExpMang.config;


import com.example.ExpMang.service.JWTService;
import com.example.ExpMang.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        System.out.println("JwtFilter: Request URI: " + request.getRequestURI());
        System.out.println("JwtFilter: Servlet Path: " + request.getServletPath());

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username  = null;

        System.out.println("JwtFilter: Authorization Header: " + authHeader);

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
            username = jwtService.extractUserName(token);
            System.out.println("JwtFilter: Token extracted: " + token);
            System.out.println("JwtFilter: Username extracted: " + username);
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            System.out.println("JwtFilter: Attempting to load UserDetails for username: " + username);
            UserDetails userDetails = context.getBean(UserService.class).loadUserByUsername(username);
            System.out.println("JwtFilter: UserDetails loaded: " + userDetails);

            if(jwtService.validateToken(token, userDetails)){
                System.out.println("JwtFilter: Token is valid.");
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("JwtFilter: Authentication set in SecurityContext.");
            } else {
                System.out.println("JwtFilter: Token is NOT valid.");
            }
        } else {
            System.out.println("JwtFilter: Username is null or SecurityContext already has authentication.");
        }

        filterChain.doFilter(request, response);
    }
}


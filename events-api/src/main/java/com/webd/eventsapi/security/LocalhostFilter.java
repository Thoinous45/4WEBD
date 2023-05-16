package com.webd.eventsapi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.InetAddress;
import java.util.List;

@Component
public class LocalhostFilter extends OncePerRequestFilter {

    private final List<String> allowedHosts = List.of("tickets-api.booking");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String remoteAddr = request.getRemoteAddr();
        InetAddress inetAddress = InetAddress.getByName(remoteAddr);
        String hostName = inetAddress.getHostName();

        if (allowedHosts.contains(hostName)) {
            filterChain.doFilter(request, response);
        } else {
            throw new ServletException("Access denied for host: " + hostName);
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getServletPath().startsWith("/api/events/book/");
    }
}

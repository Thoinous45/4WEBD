package com.webd.eventsapi.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenDecoder {

    private final JwtParser jwtParser;

    public JwtTokenDecoder(@Value("${jwt.secret-key}") String secretKey) {
        this.jwtParser = Jwts.parser().setSigningKey(secretKey.getBytes());
    }

    public String getUsernameFromToken(String token) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();
        return (String) claims.get("userId");
    }

    public String getRoleFromToken(String token) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();
        return (String) claims.get("userRight");
    }

    public boolean isValidToken(String token) {
        try {
            jwtParser.parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}

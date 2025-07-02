package com.example.memorycapsule.util;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtil {
    private final String secret = "V2h5IG5vdCBzb21lIHJhbmRvbSB0ZXh0IGZvciB0aGUgc2VjcmV5IG5vdCBzb21lIHJhbmRvbSB0ZXh0IGZvciB0aGUgc2VjcmV";
    private final long jwtExpirationMs = 86400000; // 1 day

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}

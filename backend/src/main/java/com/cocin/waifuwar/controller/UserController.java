package com.cocin.waifuwar.controller;
import com.cocin.waifuwar.dto.UserDTO;
import com.cocin.waifuwar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");

            UserDTO user = userService.createUser(username, email, password);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            var user = userService.findByUsername(username);
            if (user.isPresent() && userService.validatePassword(password, user.get().getPasswordHash())) {
                return ResponseEntity.ok(new UserDTO(user.get()));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable Long id) {
        UserDTO user = userService.getUserProfile(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}/currency")
    public ResponseEntity<UserDTO> updateUserCurrency(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        Integer coins = request.get("coins");
        Integer gems = request.get("gems");

        UserDTO user = userService.updateUserCurrency(id, coins, gems);
        return ResponseEntity.ok(user);
    }
}
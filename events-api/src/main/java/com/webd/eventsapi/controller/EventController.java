package com.webd.eventsapi.controller;

import com.webd.eventsapi.model.Event;
import com.webd.eventsapi.model.dto.EventSearchRequest;
import com.webd.eventsapi.service.EventService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllEvents(Pageable pageable) {
        Page<Event> page = eventService.getAllEvents(pageable);
        return new ResponseEntity<>(mapToResponse(page), HttpStatus.OK);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Event> getEventById(@PathVariable Long eventId) {
        return eventService.getEventById(eventId)
                .map(event -> new ResponseEntity<>(event, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/book/{eventId}")
    public ResponseEntity<HttpStatus> isBookingAvailable(@PathVariable Long eventId) {
        if (eventService.isBookingAvailable(eventId)) {
            // "pre-book" an event, the ticket service will be able to revert the booking if the user payment fails
            eventService.bookEvent(eventId);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @PostMapping("/book/revert/{eventId}")
    public ResponseEntity<HttpStatus> revertBooking(@PathVariable Long eventId) {
        eventService.revertEventBooking(eventId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/search")
    public ResponseEntity<Map<String, Object>> searchEvents(@RequestBody EventSearchRequest request, Pageable pageable) {
        Page<Event> page = eventService.searchEvents(request, pageable);
        return new ResponseEntity<>(mapToResponse(page), HttpStatus.OK);
    }

    @PostMapping
    @RolesAllowed("{OPERATOR}")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return new ResponseEntity<>(eventService.createEvent(event), HttpStatus.CREATED);
    }

    @PutMapping
    @RolesAllowed("{OPERATOR}")
    public ResponseEntity<Event> updateEvent(@RequestBody Event event) {
        return new ResponseEntity<>(eventService.updateEvent(event), HttpStatus.OK);
    }

    @DeleteMapping("/{eventId}")
    @RolesAllowed("{OPERATOR}")
    public ResponseEntity<HttpStatus> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Map<String, Object> mapToResponse(Page<Event> page) {
        List<Event> events = page.getContent();
        Map<String, Object> response = new HashMap<>();
        response.put("events", events);
        response.put("currentPage", page.getNumber());
        response.put("totalItems", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        return response;
    }
}

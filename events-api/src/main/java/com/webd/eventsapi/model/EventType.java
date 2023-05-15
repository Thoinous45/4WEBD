package com.webd.eventsapi.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class EventType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
}

package com.webd.eventsapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    private String description;

    @NotNull
    private String address;

    @NotNull
    private Date startDate;

    private Date endDate;

    @NotNull
    private Date reservationLimitDate;

    @NotNull
    private int nbOfPlaces;

    @ManyToOne
    private EventType eventType;

    @PrePersist
    public void prePersist() {
        if (this.reservationLimitDate == null) {
            long twoDaysInMillis = 2 * 24 * 60 * 60 * 1000;
            this.reservationLimitDate = new Date(this.startDate.getTime() - twoDaysInMillis);
        }
    }
}

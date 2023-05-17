create table if not exists tickets
(
    ticket_id          int(200) auto_increment
        primary key,
    user_id            varchar(200) not null,
    firstname          varchar(200) not null,
    lastname           varchar(200) not null,
    event_id           int          null,
    date               varchar(200) null,
    payment            varchar(200) null,
    event_name         varchar(200) null,
    number_reservation varchar(200) null,
    email              varchar(200) null,
    price              float        null,
    constraint number_reservation
        unique (number_reservation)
);



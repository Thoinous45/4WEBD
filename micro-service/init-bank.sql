create table if not exists account
(
    account_id        int auto_increment
        primary key,
    balance           float                   not null,
    user_id           int                     not null,
    name_account      varchar(200)            null,
    numberCard        bigint                  not null,
    end_validity_date varchar(20) default '0' null,
    cvv               varchar(10)             null
);

INSERT INTO account (account_id, balance, user_id, name_account, numberCard, end_validity_date, cvv) VALUES (1, 5000, 1, 'Valentin Dujardin', 2412751234123456, '02/2026', '123');
INSERT INTO account (account_id, balance, user_id, name_account, numberCard, end_validity_date, cvv) VALUES (2, 300, 2, 'Compte Ticket', 2412751234123455, '02/2026', '123');

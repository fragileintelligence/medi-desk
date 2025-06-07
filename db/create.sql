CREATE TABLE `user`
(
    `id`         INT          NOT NULL AUTO_INCREMENT,
    `username`   VARCHAR(16)  NOT NULL,
    `email`      VARCHAR(100) NOT NULL,
    `password`   VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
);

CREATE TABLE `user_session`
(
    `id`         VARCHAR(255) NOT NULL,
    `user_id`    INT          NOT NULL,
    `expires_at` DATETIME     NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
)

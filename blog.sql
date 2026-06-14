create table users (
 uid serial primary key,
 user_uuid UUID not null default gen_random_uuid(),
 firstName varchar(100) not null,
 lastName varchar(100) null,
 email varchar(100) not null,
 password text not null
 
)

create table posts (
 pid serial primary key, 
 post_uuid UUID not null default gen_random_uuid(),
 title varchar(255) not null,
 description text not null,
 creator int not null,
 created_when timestamp default now(),
 updated_when timestamp null
)

ALTER TABLE posts ADD CONSTRAINT fk_post_creator FOREIGN KEY (creator) REFERENCES users(uid);

INSERT INTO groups(name) VALUES('土');
INSERT INTO groups(name) VALUES('水');

INSERT INTO users(name,email,group_id,password) VALUES('山田太郎', 'yama@mail.com', 1, 'secret1');
INSERT INTO users(name,email,group_id,password) VALUES('岡田太郎', 'oka@mail.com',  1, 'secret1');
INSERT INTO users(name,email,group_id,password) VALUES('川田太郎', 'kawa@mail.com', 2, 'secret1');
INSERT INTO users(name,email,group_id,password) VALUES('海田太郎', 'umi@mail.com',  2, 'secret1');

UPDATE users SET password='$2b$10$Si/fyYPFucz5sme0j/10GOawFOXB7jhi6T2hhDfTOjL1lreCsNYwa';
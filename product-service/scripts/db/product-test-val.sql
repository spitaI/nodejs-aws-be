insert into products (title, summary, author, pages, published, price, image) values
('1Q84', 'In “1Q84,” the Japanese novelist Haruki Murakami writes about characters in a Tokyo with two moons.', 'Haruki Murakami', 213, '2011-11-10T00:00:00.000Z', 20.5, 'https://cdn25.img.ria.ru/images/39074/33/390743378_0:0:0:0_1440x900_80_0_1_192395f48eed77bc9df4ae758647e8fe.jpg.webp?source-sid=flickr'),
('Programming JavaScript Applications', 'Take advantage of JavaScripts power to build robust web-scale or enterprise applications that are easy to extend and maintain. By applying the design patterns outlined in this practical book, experienced JavaScript developers will learn how to write flexible and resilient code thats easier-yes, easier-to work with as your code base grows.', 'Eric Elliott', 254, '2014-07-01T00:00:00.000Z', 50, 'https://images-na.ssl-images-amazon.com/images/I/512Hli3f6FL._AC_UL600_SR456,600_.jpg'),
('Git Pocket Guide', 'This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git experience.', 'Richard E. Silverman', 234, '2013-08-02T00:00:00.000Z', 30.3, 'https://images-na.ssl-images-amazon.com/images/I/41hZDooM2zL._SX302_BO1,204,203,200_.jpg'),
('Understanding ECMAScript 6', 'A complete guide to the object types, syntax, and other exciting changes that ECMAScript 6 brings to JavaScript.', 'Nicholas C. Zakas', 352, '2016-09-03T00:00:00.000Z', 69.99, 'https://images-na.ssl-images-amazon.com/images/I/51+Ee6EuenL._SX376_BO1,204,203,200_.jpg');

insert into stock (count, product_id) values
(2, (select id from products where title = '1Q84')),
(1, (select id from products where title = 'Programming JavaScript Applications')),
(3, (select id from products where title = 'Git Pocket Guide')),
(2, (select id from products where title = 'Understanding ECMAScript 6'));

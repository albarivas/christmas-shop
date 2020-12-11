DROP TABLE IF EXISTS family_member_product;
DROP TABLE IF EXISTS family_member;
DROP TABLE IF EXISTS product;

create table product(
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255),
  product_description VARCHAR(255),
  units_in_inventory INTEGER,
  credits INTEGER,
  picture VARCHAR(255)
);

create table family_member(
  id SERIAL PRIMARY KEY ,
  family_member_name VARCHAR(255),
  credits_available INTEGER
);

create table family_member_product(
  family_member INTEGER REFERENCES family_member,
  product INTEGER REFERENCES product,
  units INTEGER,
  PRIMARY KEY (family_member, product)
);

/* TEST DATA */
INSERT INTO product(product_name, product_description, units_in_inventory, credits, picture)
VALUES  ('Small Christmas Tree','Christmas Tree printed illustration, small size', 50, 100, 'resources/images/arbol-peq.png'),
        ('Medium Christmas Tree','Christmas Tree printed illustration, medium size', 50, 100, 'resources/images/arbol-med.png'),
        ('Big Christmas Tree','Christmas Tree printed illustration, big size', 5, 300, 'resources/images/arbol-gra.png'),
        ('Small Snowman','Snowman printed illustration, small size', 50, 80, 'resources/images/muneco-peq.png'),
        ('Medium Snowman','Snowman printed illustration, medium size', 20, 160, 'resources/images/muneco-med.png'),
        ('Big Snowman','Snowman printed illustration, big size', 5, 240, 'resources/images/muneco-gra.png'),
        ('Small Reindeer','Reindeer printed illustration, small size', 50, 150, 'resources/images/reno-peq.png'),
        ('Medium Reindeer','Reindeer printed illustration, medium size', 20, 250, 'resources/images/reno-med.png'),
        ('Big Reindeer','Reindeer printed illustration, big size', 5, 350, 'resources/images/reno-gra.png');


INSERT INTO family_member(family_member_name, credits_available)
VALUES  ('Ana', 1000),
        ('Edi', 800),
        ('Raúl', 1200),
        ('Feli', 700),
        ('Alba', 850),
        ('Patxi', 1300);

INSERT INTO family_member_product(family_member, product, units)
VALUES  (1, 1, 5),
        (1, 4, 10),
        (1, 3, 8),
        (2, 2, 3),
        (2, 7, 12),
        (2, 8, 6);
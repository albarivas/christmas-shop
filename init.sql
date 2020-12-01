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
VALUES  ('Árbol de Navidad Pequeño','Ilustración impresa del Árbol de Navidad de la Mansión, tamaño pequeño', 50, 100, 'products/arbol-peq.png'),
        ('Árbol de Navidad Mediano','Ilustración impresa del Árbol de Navidad de la Mansión, tamaño mediano', 20, 200, 'products/arbol-med.png'),
        ('Árbol de Navidad Grande','Ilustración impresa del Árbol de Navidad de la Mansión, tamaño grande', 5, 300, 'products/arbol-gra.png'),
        ('Muñeco de Nieve Pequeño','Ilustración impresa de Muñeco de Nieve, tamaño pequeño', 50, 80, 'products/muneco-peq.png'),
        ('Muñeco de Nieve Mediano','Ilustración impresa de Muñeco de Nieve, tamaño mediano', 20, 160, 'products/muneco-med.png'),
        ('Muñeco de Nieve Grande','Ilustración impresa de Muñeco de Nieve, tamaño grande', 5, 240, 'products/muneco-gra.png'),
        ('Reno Pequeño','Ilustración impresa de Reno, tamaño pequeño', 50, 150, 'products/reno-peq.png'),
        ('Reno Mediano','Ilustración impresa de Reno, tamaño mediano', 20, 250, 'products/reno-med.png'),
        ('Reno Grande','Ilustración impresa de Reno, tamaño grande', 5, 350, 'products/reno-gra.png');


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
        (1, 9, 8),
        (2, 2, 3),
        (2, 7, 12),
        (2, 8, 6);
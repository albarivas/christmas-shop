DROP TABLE IF EXISTS product;

create table product(
  product_number INTEGER PRIMARY KEY,
  product_name VARCHAR(255),
  product_description VARCHAR(255),
  units_in_inventory INTEGER,
  credits INTEGER,
  picture BYTEA
);

/* TEST DATA */
INSERT INTO product(product_number, product_name, product_description, units_in_inventory, price)
VALUES  (1,'Árbol de Navidad Pequeño','Ilustración impresa del Árbol de Navidad de la Mansión, tamaño pequeño', 50, 100),
        (2,'Árbol de Navidad Mediano','Ilustración impresa del Árbol de Navidad de la Mansión, tamaño pequeño', 20, 200),
        (3,'Árbol de Navidad Grande','Ilustración impresa del Árbol de Navidad de la Mansión, tamaño pequeño', 5, 300),
        (4,'Muñeco de Nieve Pequeño','Ilustración impresa de Muñeco de Nieve, tamaño pequeño', 50, 80),
        (5,'Muñeco de Nieve Mediano','Ilustración impresa de Muñeco de Nieve, tamaño pequeño', 20, 160),
        (6,'Muñeco de Nieve Grande','Ilustración impresa de Muñeco de Nieve, tamaño pequeño', 5, 240),
        (7,'Reno Pequeño','Ilustración impresa de Reno, tamaño pequeño', 50, 150),
        (8,'Reno Mediano','Ilustración impresa de Reno, tamaño pequeño', 20, 250),
        (9,'Reno Grande','Ilustración impresa de Reno, tamaño pequeño', 5, 350),
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
INSERT INTO product(product_number, product_name, product_description, units_in_inventory, credits, picture)
VALUES  (1,'Árbol de Navidad Pequeño','Ilustración impresa del Árbol de Navidad de la Mansión, tamaño pequeño', 50, 100, bytea('images/products/arbol-peq.png')),
        (2,'Árbol de Navidad Mediano','Ilustración impresa del Árbol de Navidad de la Mansión, tamaño mediano', 20, 200, bytea('images/products/arbol-med.png')),
        (3,'Árbol de Navidad Grande','Ilustración impresa del Árbol de Navidad de la Mansión, tamaño grande', 5, 300, bytea('images/products/arbol-gra.png')),
        (4,'Muñeco de Nieve Pequeño','Ilustración impresa de Muñeco de Nieve, tamaño pequeño', 50, 80, bytea('images/products/muneco-peq.png')),
        (5,'Muñeco de Nieve Mediano','Ilustración impresa de Muñeco de Nieve, tamaño mediano', 20, 160, bytea('images/products/muneco-med.png')),
        (6,'Muñeco de Nieve Grande','Ilustración impresa de Muñeco de Nieve, tamaño grande', 5, 240, bytea('images/products/muneco-gra.png')),
        (7,'Reno Pequeño','Ilustración impresa de Reno, tamaño pequeño', 50, 150, bytea('images/products/reno-peq.png')),
        (8,'Reno Mediano','Ilustración impresa de Reno, tamaño mediano', 20, 250, bytea('images/products/reno-med.png')),
        (9,'Reno Grande','Ilustración impresa de Reno, tamaño grande', 5, 350, bytea('images/products/reno-gra.png'));
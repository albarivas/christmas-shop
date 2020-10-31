DROP TABLE IF EXISTS invoice_line;
DROP TABLE IF EXISTS invoice;

create table invoice(
  invoice_number INTEGER PRIMARY KEY,
  session_id VARCHAR(255),
  order_number INTEGER,
  sold_to VARCHAR(255),
  ship_to VARCHAR(255),
  bill_to VARCHAR(255),
  customer_number INTEGER,
  total_value DECIMAL,
  total_taxes DECIMAL
);
create table invoice_line(
  invoice_line_number INTEGER,
  invoice_number INTEGER REFERENCES invoice(invoice_number),
  quantity INTEGER,
  item VARCHAR(255),
  product_number INTEGER,
  price DECIMAL,
  vat DECIMAL,
  PRIMARY KEY (invoice_number, invoice_line_number)
);

/* TEST DATA */
INSERT INTO invoice(invoice_number, session_id, order_number, sold_to, ship_to, bill_to, customer_number, total_value, total_taxes)
VALUES  (1203,'as765ashgdahv4Dxij',3246,'Alba Rivas','Alba Rivas','Alba Rivas',230,3510.50,349.20),
        (1204,'asdda34657Ggvadsbs',3247,'Cleston Oliveira','Cleston Oliveira','Cleston Oliveira',75,10987.35,579.30),
        (1205,'lfgjkdhyU8a7sdghbd',3248,'Pedro Molina','Pedro Molina','Pedro Molina',450,1563.70,135.90);

INSERT INTO invoice_line(invoice_line_number,invoice_number, quantity, item, product_number, price, vat)
VALUES  (1,1203,1,'Macbook PRO X',234,1200.30,15),
        (2,1203,1,'Dell 1234',786,987.5,15),
        (1,1204,1,'Macbook PRO X',234,1200.30,15),
        (2,1204,1,'iPhone 8',366,887.3,15),
        (3,1204,1,'Dell 1234',786,987.5,15),
        (1,1205,1,'Xiaomi Pure',383,500,15),
        (2,1205,1,'LG colors',900,334.7,15);



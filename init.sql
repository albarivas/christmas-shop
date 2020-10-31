DROP TABLE IF EXISTS order_line CASCADE;
DROP TABLE IF EXISTS sales_order CASCADE;

create table sales_order(
  order_number INTEGER PRIMARY KEY,
  session_id VARCHAR(255),
  sales_org VARCHAR(255),
  sold_to VARCHAR(255),
  ship_to VARCHAR(255),
  bill_to VARCHAR(255),
  delivery_terms VARCHAR(255),
  delivery_date DATE,
  status VARCHAR(255)
);
create table order_line(
  order_line_number INTEGER,
  order_number INTEGER REFERENCES sales_order(order_number),
  step VARCHAR(255),
  quantity INTEGER,
  item VARCHAR(255),
  product_number INTEGER,
  delivery_schedule DATE,
  plant VARCHAR(255),
  PRIMARY KEY (order_number, order_line_number)
);

/* TEST DATA */
INSERT INTO sales_order(order_number, session_id, sales_org, sold_to, ship_to, bill_to, delivery_terms, delivery_date, status)
VALUES  (203,'as765ashgdahv4Dxij','Clesworks Spain','Alba Rivas','Alba Rivas','Alba Rivas','15 days max','2020-06-15','dispatched'),
        (204,'asdda34657Ggvadsbs','Clesworks Amsterdam','Cleston Oliveira','Cleston Oliveira','Cleston Oliveira','15 days max','2020-05-15','delivered'),
        (205,'lfgjkdhyU8a7sdghbd','Clesworks UK','Pedro Molina','Pedro Molina','Pedro Molina','15 days max','2020-05-15','delivered');

INSERT INTO order_line (order_line_number, order_number, step, quantity, item, product_number, delivery_schedule, plant)
VALUES  (1,203,'in_transit',1,'Macbook PRO X',234,'2020-06-15','warehouse A'),
        (2,203,'in_transit',1,'Dell 1234',786,'2020-06-15','warehouse A'),
        (1,204,'delivered',1,'Macbook PRO X',234,'2020-05-15','warehouse A'),
        (2,204,'delivered',1,'iPhone 8',366,'2020-05-15','warehouse A'),
        (3,204,'delivered',1,'Dell 1234',786,'2020-05-15','warehouse A'),
        (1,205,'delivered',1,'Xiaomi Pure',383,'2020-05-15','warehouse A'),
        (2,205,'delivered',1,'LG colors',900,'2020-05-15','warehouse A');



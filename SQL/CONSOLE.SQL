SHOW tables;

CREATE TABLE usuarios
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) not null,
    codigo_barra INT NOT NULL,
    deuda_total INT NOT NULL DEFAULT 0,
    activo INT NOT NULL DEFAULT 1
);

CREATE TABLE consumos
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    monto INT NOT NULL,
    activo INT NOT NULL DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO usuarios (NOMBRE, CODIGO_BARRA)
VALUES('Santiago', 1231234);

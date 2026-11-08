-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ecommerce
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ecommerce
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ecommerce` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `ecommerce` ;

-- -----------------------------------------------------
-- Table `ecommerce`.`categorias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecommerce`.`categorias` ;

CREATE TABLE IF NOT EXISTS `ecommerce`.`categorias` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_categoria`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ecommerce`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecommerce`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `ecommerce`.`usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(80) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `clave_hash` VARCHAR(25) NOT NULL,
  `celular` VARCHAR(15) NULL DEFAULT NULL,
  `talla_habitual` VARCHAR(4) NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ecommerce`.`direcciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecommerce`.`direcciones` ;

CREATE TABLE IF NOT EXISTS `ecommerce`.`direcciones` (
  `id_direccion` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `ciudad` VARCHAR(60) NOT NULL,
  `direccion` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id_direccion`),
  INDEX `fk_direcciones_usuarios` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_direcciones_usuarios`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `ecommerce`.`usuarios` (`id_usuario`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ecommerce`.`pedidos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecommerce`.`pedidos` ;

CREATE TABLE IF NOT EXISTS `ecommerce`.`pedidos` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NULL,
  `estado` VARCHAR(20) NOT NULL,
  `costo_envio` DECIMAL(10,0) NOT NULL,
  `total` DECIMAL(12,0) NOT NULL,
  `id_usuario` INT NOT NULL,
  `id_direccion` INT NOT NULL,
  PRIMARY KEY (`id_pedido`),
  INDEX `fk_pedidos_usuarios` (`id_usuario` ASC) VISIBLE,
  INDEX `fk_pedidos_direcciones` (`id_direccion` ASC) VISIBLE,
  CONSTRAINT `fk_pedidos_direcciones`
    FOREIGN KEY (`id_direccion`)
    REFERENCES `ecommerce`.`direcciones` (`id_direccion`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pedidos_usuarios`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `ecommerce`.`usuarios` (`id_usuario`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ecommerce`.`productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecommerce`.`productos` ;

CREATE TABLE IF NOT EXISTS `ecommerce`.`productos` (
  `id_producto` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(80) NOT NULL,
  `precio` DECIMAL(10,0) NOT NULL,
  `gramaje_gsm` INT NOT NULL,
  `id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_producto`),
  INDEX `fk_productos_categorias` (`id_categoria` ASC) VISIBLE,
  CONSTRAINT `fk_productos_categorias`
    FOREIGN KEY (`id_categoria`)
    REFERENCES `ecommerce`.`categorias` (`id_categoria`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ecommerce`.`variantes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecommerce`.`variantes` ;

CREATE TABLE IF NOT EXISTS `ecommerce`.`variantes` (
  `id_variante` INT NOT NULL AUTO_INCREMENT,
  `id_producto` INT NOT NULL,
  `talla` VARCHAR(4) NOT NULL,
  `color` VARCHAR(30) NOT NULL,
  `stock` INT NOT NULL,
  PRIMARY KEY (`id_variante`),
  INDEX `fk_variantes_productos` (`id_producto` ASC) VISIBLE,
  CONSTRAINT `fk_variantes_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `ecommerce`.`productos` (`id_producto`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ecommerce`.`detalle_pedido`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecommerce`.`detalle_pedido` ;

CREATE TABLE IF NOT EXISTS `ecommerce`.`detalle_pedido` (
  `id_pedido` INT NOT NULL,
  `id_variante` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(10,0) NOT NULL,
  PRIMARY KEY (`id_pedido`, `id_variante`),
  INDEX `fk_detalle_pedido_variantes` (`id_variante` ASC) VISIBLE,
  CONSTRAINT `fk_detalle_pedido_pedidos`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `ecommerce`.`pedidos` (`id_pedido`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_pedido_variantes`
    FOREIGN KEY (`id_variante`)
    REFERENCES `ecommerce`.`variantes` (`id_variante`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ecommerce`.`pagos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ecommerce`.`pagos` ;

CREATE TABLE IF NOT EXISTS `ecommerce`.`pagos` (
  `id_pago` INT NOT NULL AUTO_INCREMENT,
  `id_pedido` INT NOT NULL,
  `medio` VARCHAR(20) NOT NULL,
  `valor` DECIMAL(12,0) NOT NULL,
  PRIMARY KEY (`id_pago`),
  INDEX `fk_pagos_pedidos` (`id_pedido` ASC) VISIBLE,
  CONSTRAINT `fk_pagos_pedidos`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `ecommerce`.`pedidos` (`id_pedido`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

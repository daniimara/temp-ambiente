----------------- HOME ---------------------------------------------------

SELECT l.descricao, a.descricao, s.descricao,
a.temperatura_media, a.temperatura_minima, a.temperatura_maxima,
s.temperatura
FROM LOCAL l
INNER JOIN AMBIENTE a ON l.id = a.id_local
INNER JOIN SENSOR s ON a.id = s.id_ambiente
WHERE l.status = 1 AND a.status = 1 AND s.status = 1
AND s.temperatura NOT BETWEEN a.temperatura_minima AND a.temperatura_maxima;

----------------- LOCAL ---------------------------------------------------
SELECT * FROM LOCAL;
TRUNCATE TABLE LOCAL IMMEDIATE;
DROP TABLE LOCAL;
CREATE TABLE LOCAL ( 
   id             INT NOT NULL,
   descricao      VARCHAR(150) NOT NULL,
   status         CHAR(1) NOT NULL,
   data_criacao   TIMESTAMP WITH DEFAULT CURRENT TIMESTAMP,
   data_alteracao TIMESTAMP WITH DEFAULT CURRENT TIMESTAMP,
   CONSTRAINT PK_LOCAL_ID PRIMARY KEY (id));
CREATE SEQUENCE LOCAL_SEQ AS INT 
   START WITH 1 
   INCREMENT BY 1 
   MINVALUE 1 
   NO MAXVALUE 
   NO CYCLE 
   NO CACHE 
   ORDER;
ALTER SEQUENCE LOCAL_SEQ RESTART WITH 1;
INSERT INTO LOCAL (id, descricao, status) VALUES (LOCAL_SEQ.nextval, 'IBM Tutóia SP', 1);
INSERT INTO LOCAL (id, descricao, status) VALUES (LOCAL_SEQ.nextval, 'IBM Century Towner BH', 2);
INSERT INTO LOCAL (id, descricao, status) VALUES (LOCAL_SEQ.nextval, 'IBM Pasteur RJ', 2);
INSERT INTO LOCAL (id, descricao, status) VALUES (LOCAL_SEQ.nextval, 'IBM Brasília BSC', 2);
COMMIT;
---------------------------------------------------------------------
----------------- AMBIENTE ------------------------------------------
SELECT * FROM AMBIENTE;
TRUNCATE TABLE AMBIENTE IMMEDIATE;
DROP TABLE AMBIENTE;
CREATE TABLE AMBIENTE ( 
   id                 INT NOT NULL,
   id_local           INT NOT NULL,
   descricao          VARCHAR(150) NOT NULL,
   temperatura_media  INT NULL,
   temperatura_minima INT NOT NULL,
   temperatura_maxima INT NOT NULL,
   status             CHAR(1) NOT NULL,
   data_criacao       TIMESTAMP WITH DEFAULT CURRENT TIMESTAMP,
   data_alteracao     TIMESTAMP WITH DEFAULT CURRENT TIMESTAMP,
   CONSTRAINT FK_LOCAL_ID FOREIGN KEY (id_local) REFERENCES LOCAL (ID) ON DELETE RESTRICT,
   CONSTRAINT PK_AMBIENTE_ID PRIMARY KEY (id));
CREATE SEQUENCE AMBIENTE_SEQ AS INT 
   START WITH 1 
   INCREMENT BY 1 
   MINVALUE 1 
   NO MAXVALUE 
   NO CYCLE 
   NO CACHE 
   ORDER;
ALTER SEQUENCE AMBIENTE_SEQ RESTART WITH 1;
INSERT INTO AMBIENTE (id, id_local, descricao, temperatura_media, temperatura_minima, temperatura_maxima, status) VALUES (AMBIENTE_SEQ.nextval, 1, 'Sala de Reunião 1 - 3o Andar', 0, 20, 25, 1);
INSERT INTO AMBIENTE (id, id_local, descricao, temperatura_media, temperatura_minima, temperatura_maxima, status) VALUES (AMBIENTE_SEQ.nextval, 2, 'Sala de Reunião 2 - 3o Andar', 0, 5, 10, 1);
INSERT INTO AMBIENTE (id, id_local, descricao, temperatura_media, temperatura_minima, temperatura_maxima, status) VALUES (AMBIENTE_SEQ.nextval, 3, 'Sala de Reunião 6 - 5o Andar', 0, 25, 30, 1);
COMMIT;
---------------------------------------------------------------------
----------------- SENSOR --------------------------------------------
SELECT * FROM SENSOR ORDER BY ID;
TRUNCATE TABLE SENSOR IMMEDIATE;
DROP TABLE SENSOR;
CREATE TABLE SENSOR ( 
   id             INT NOT NULL,
   id_ambiente    INT NOT NULL,
   descricao      VARCHAR(150) NOT NULL,
   device_id      VARCHAR(12) NOT NULL,
   temperatura    INT NOT NULL,
   status         CHAR(1) NOT NULL,
   data_criacao   TIMESTAMP WITH DEFAULT CURRENT TIMESTAMP,
   data_alteracao TIMESTAMP WITH DEFAULT CURRENT TIMESTAMP,
   CONSTRAINT FK_AMBIENTE_ID FOREIGN KEY (id_ambiente) REFERENCES AMBIENTE (ID) ON DELETE RESTRICT,
   CONSTRAINT PK_SENSOR_ID PRIMARY KEY (id));
CREATE SEQUENCE SENSOR_SEQ AS INT 
   START WITH 1 
   INCREMENT BY 1 
   MINVALUE 1 
   NO MAXVALUE 
   NO CYCLE 
   NO CACHE 
   ORDER;
ALTER SEQUENCE SENSOR_SEQ RESTART WITH 1;
INSERT INTO SENSOR (id, id_ambiente, descricao, device_id, temperatura, status) VALUES (SENSOR_SEQ.nextval, 1, 'Sensor Real', '14a3643cbb11', 0, 1);
INSERT INTO SENSOR (id, id_ambiente, descricao, device_id, temperatura, status) VALUES (SENSOR_SEQ.nextval, 1, 'Sensor Teste 1', '4c8093103187', 0, 1);
INSERT INTO SENSOR (id, id_ambiente, descricao, device_id, temperatura, status) VALUES (SENSOR_SEQ.nextval, 2, 'Sensor Teste 2', '4c0bbee2e258', 0, 1);
INSERT INTO SENSOR (id, id_ambiente, descricao, device_id, temperatura, status) VALUES (SENSOR_SEQ.nextval, 3, 'Sensor Teste 3', '5c0bbee2e333', 0, 1);
INSERT INTO SENSOR (id, id_ambiente, descricao, device_id, temperatura, status) VALUES (SENSOR_SEQ.nextval, 3, 'Sensor Teste 4', '9c8093101234', 0, 1);
COMMIT;

SELECT s.id, s.id_ambiente, s.descricao AS descricao_sensor, s.temperatura, s.status,
a.descricao AS descricao_ambiente, l.descricao AS descricao_local
FROM SENSOR s
INNER JOIN AMBIENTE a ON a.id = s.id_ambiente
INNER JOIN LOCAL l ON l.id = a.id_local;
      
---------------------------------------------------------------------
----------------- HISTORICO_SENSOR ----------------------------------
SELECT * FROM HISTORICO_SENSOR hs ORDER BY hs.data_criacao DESC, hs.id_sensor ASC;
SELECT hs.id_sensor, s.descricao, hs.device_id, hs.temperatura, hs.data_criacao
FROM HISTORICO_SENSOR hs
INNER JOIN SENSOR s ON s.id = hs.id_sensor
ORDER BY hs.data_criacao DESC, hs.id_sensor ASC;
SELECT MAX(TEMPERATURA), MIN(TEMPERATURA) FROM HISTORICO_SENSOR;
TRUNCATE TABLE HISTORICO_SENSOR IMMEDIATE;
DROP TABLE HISTORICO_SENSOR;
CREATE TABLE HISTORICO_SENSOR ( 
   id            INT NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
   id_sensor     INT NULL,
   device_id     VARCHAR(12) NOT NULL,
   temperatura   INT NOT NULL,
   data_criacao  TIMESTAMP WITH DEFAULT CURRENT TIMESTAMP,
   --CONSTRAINT FK_SENSOR_ID FOREIGN KEY (id_sensor) REFERENCES SENSOR (ID) ON DELETE RESTRICT,
   CONSTRAINT PK_HISTORICO_SENSOR_ID PRIMARY KEY (id));
   
DROP TRIGGER USER08782.tNOVA_TEMPERATURA_SENSOR;

CREATE TRIGGER tNOVA_TEMPERATURA_SENSOR
  AFTER INSERT ON HISTORICO_SENSOR
  REFERENCING NEW AS n
  FOR EACH ROW
  BEGIN ATOMIC
    DECLARE vIdSensor INTEGER;
    DECLARE vIdAmbiente INTEGER;
    DECLARE vTemperaturaMedia INTEGER;
    
    SET vIdSensor = (SELECT id 
    FROM SENSOR WHERE device_id = n.device_id);
    
    UPDATE SENSOR SET temperatura = n.temperatura, data_alteracao = CURRENT TIMESTAMP WHERE id = vIdSensor;
    
    UPDATE HISTORICO_SENSOR SET id_sensor = vIdSensor WHERE id = n.id;
    
    SET vIdAmbiente = (SELECT id_ambiente 
    FROM SENSOR WHERE id = vIdSensor);
    
    SET vTemperaturaMedia = (SELECT AVG(temperatura)
    FROM SENSOR WHERE status = 1 AND id_ambiente = vIdAmbiente);
    
    UPDATE AMBIENTE SET temperatura_media = vTemperaturaMedia WHERE id = vIdAmbiente;
    
    DELETE FROM HISTORICO_SENSOR WHERE DATA_CRIACAO < (CURRENT DATE - 2 DAYS);
END
---------------------------------------------------------------------
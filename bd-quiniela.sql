create table roles( 
id_role serial primary key,
tipo varchar(50) unique not null 
); 

create table usuarios( 
id_usuario serial primary key,
nombre varchar(50) not null,
apellido varchar(50) not null,
correo varchar(100) unique not null,
password_hash varchar(100) not null,
id_role int references roles(id_role) 
);	

create table jornadas(
id_jornada serial primary key,
nombre varchar(50),
estado int not null,
fecha_inicio date not null,
fecha_fin date not null 
);

create table grupos(
id_grupo serial primary key,
nombre varchar(3) 
);

create table equipos(
id_equipo serial primary key,
nombre varchar(70) not null,
id_grupo int references grupos(id_grupo)
);

create table partidos(
id_partido serial primary key,
id_jornada int references jornadas (id_jornada),
equipo_local int references equipos (id_equipo),
equipo_visitante int references equipos (id_equipo),
fecha_partido date not null,
hora_partido time not null,
estado int default 0
);

create table resultados(
id_resultado serial primary key,
id_partido int references partidos(id_partido),
goles_local int not null,
goles_visitante int not null
); 

create table pronosticos(
id_pronostico serial primary key,
id_usuario int references usuarios (id_usuario),
id_partido int references partidos(id_partido),
pronostico varchar(2), --si pronostica local L visitante V o empate E 
goles_local int,
goles_visitante int,
puntos int
);

create index idx_pronosticos_usuario
on pronosticos(id_usuario);

create index idx_pronosticos_partido
on pronosticos(id_partido);

create index idx_partidos_jornada
on partidos(id_jornada);

drop table roles, usuarios, jornadas, grupos, equipos, partidos, resultados, pronosticos;

INSERT INTO roles (tipo) VALUES ('ADMIN');
INSERT INTO roles (tipo) VALUES ('PARTICIPANTE');
INSERT INTO usuarios (nombre, apellido, correo, password_hash, id_role) VALUES ('BERNARDO','ESCOBEDO','PRUEBAS@PRUBAS.COM','12345678',1);
INSERT INTO usuarios (nombre, apellido, correo, password_hash, id_role) VALUES ('JORGE LUIS','ESCOBEDO','PRUEBAS2@PRUBAS.COM','12345678',2);

--INSERT DE JORNADAS
INSERT INTO jornadas (nombre, estado, fecha_inicio, fecha_fin) VALUES 
('Fase de Grupos - Jornada 1', 1, '2026-04-04', '2026-04-05')

--INSERT DE GRUPOS
INSERT INTO grupos (nombre) VALUES ('A')
--INSERT DE EQUIPOS
INSERT INTO equipos (nombre, id_grupo) VALUES
-- Grupo A (ID: 1)
('México', 1), ('República Checa', 1), ('Sudáfrica', 1), ('Corea del Sur', 1)

INSERT INTO partidos (id_jornada, equipo_local, equipo_visitante, fecha_partido, hora_partido) VALUES
-- Grupo A y B
(1, 1, 2, '2026-06-11', '19:00:00'), (1, 3, 4, '2026-06-12', '13:00:00')

select *from partidos

INSERT INTO equipos (nombre, id_grupo) VALUES ('MEXICO',1),('SUDAFRICA',1);
INSERT INTO jornadas (nombre,estado,fecha_inicio,fecha_fin) VALUES ('FECHA 1',1,'11-06-2026','17-06-2026');
INSERT INTO partidos(id_jornada,equipo_local,equipo_visitante,fecha_partido,hora_partido) VALUES (1,1,2,'11-06-2026','13:00:00');
INSERT INTO resultados (id_partido,goles_local,goles_visitante) VALUES (1,2,0);

--CONSULTAS
select *from roles
select *from usuarios
select *from partidos
select *from grupos
select *from equipos
select *from jornadas
select *from resultados
select *from pronosticos

select
e.nombre,
g.nombre as grupo
from equipos e 
join grupos g on e.id_grupo = g.id_grupo

SELECT
e.nombre,
g.nombre AS grupo
FROM equipos e 
JOIN grupos g ON e.id_grupo = g.id_grupo
WHERE e.id_equipo = 1



INSERT INTO pronosticos (id_usuario, id_partido, pronostico, goles_local, goles_visitante) VALUES (1,1,'L',2,1)
INSERT INTO pronosticos (id_usuario, id_partido, pronostico) VALUES (2,1,'E')
INSERT INTO pronosticos (id_usuario, id_partido, pronostico, goles_local, goles_visitante) VALUES (1,2,'V',0,1)
INSERT INTO pronosticos (id_usuario, id_partido, pronostico, goles_local, goles_visitante) VALUES (2,2,'E',1,1)

INSERT INTO resultados (id_partido, goles_local, goles_visitante) VALUES (1,2,1)
INSERT INTO resultados (id_partido, goles_local, goles_visitante) VALUES (2,1,1)

update usuarios set id_role = 1 where id_usuario = 3


SELECT
p.id_partido,
j.nombre as jornada,
el.nombre as equipo_local,
ev.nombre as aquipo_visitante,
p.fecha_partido,
p.hora_partido,
p.estado
FROM partidos p
join jornadas j on p.id_jornada = j.id_jornada 
JOIN equipos el on p.equipo_local = el.id_equipo 
JOIN equipos ev on p.equipo_visitante = ev.id_equipo
WHERE p.id_partido = 2


--Funcion para calcular puntos
create or replace function calcular_puntos()
returns trigger as
$$
begin

update pronosticos p
set puntos =
case
    when p.goles_local = new.goles_local
     and p.goles_visitante = new.goles_visitante
    then 5

    when (
        (p.pronostico = 'L' and new.goles_local > new.goles_visitante)
        or
        (p.pronostico = 'V' and new.goles_visitante > new.goles_local)
        or
        (p.pronostico = 'E' and new.goles_local = new.goles_visitante)
    )
    then 3

    else 0
end
where p.id_partido = new.id_partido;

return new;

end;
$$ language plpgsql;


-- Lo usamos cubriendo INSERT y UPDATE
CREATE TRIGGER trigger_calcular_puntos
AFTER INSERT OR UPDATE ON resultados
FOR EACH ROW
EXECUTE FUNCTION calcular_puntos();


--CONSULTA DE POSICIONES DE USUARIOS
SELECT
u.nombre,
u.apellido,
SUM(p.puntos) puntos
FROM usuarios u
LEFT JOIN pronosticos p
ON u.id_usuario = p.id_usuario
GROUP BY u.id_usuario
ORDER BY puntos DESC;


--CONSULTA DE POSICIONES DE EQUIPOS
SELECT
e.id_equipo,
e.nombre AS equipo,
COUNT(*) AS pj,
SUM(CASE 
    WHEN t.goles_favor > t.goles_contra THEN 1 
    ELSE 0 
END) AS pg,
SUM(CASE 
    WHEN t.goles_favor = t.goles_contra THEN 1 
    ELSE 0 
END) AS pe,
SUM(CASE 
    WHEN t.goles_favor < t.goles_contra THEN 1 
    ELSE 0 
END) AS pp,
SUM(t.goles_favor) AS gf,
SUM(t.goles_contra) AS gc,
SUM(t.goles_favor - t.goles_contra) AS dg,
SUM(CASE 
    WHEN t.goles_favor > t.goles_contra THEN 3
    WHEN t.goles_favor = t.goles_contra THEN 1
    ELSE 0
END) AS pts
FROM equipos e
JOIN (
    -- equipo local
    SELECT
    p.equipo_local AS id_equipo,
    r.goles_local AS goles_favor,
    r.goles_visitante AS goles_contra
    FROM partidos p
    JOIN resultados r ON p.id_partido = r.id_partido
	UNION ALL
    -- equipo visitante
    SELECT
    p.equipo_visitante AS id_equipo,
    r.goles_visitante AS goles_favor,
    r.goles_local AS goles_contra
    FROM partidos p
    JOIN resultados r ON p.id_partido = r.id_partido
) t ON e.id_equipo = t.id_equipo
GROUP BY e.id_equipo, e.nombre
ORDER BY pts DESC, dg DESC, gf DESC;

--CONSULTA DE POSICIONES DE EQUIPOS POR GRUPOS
SELECT
g.nombre AS grupo,
e.nombre AS equipo,
COUNT(*) pj,
SUM(CASE WHEN t.goles_favor > t.goles_contra THEN 1 ELSE 0 END) pg,
SUM(CASE WHEN t.goles_favor = t.goles_contra THEN 1 ELSE 0 END) pe,
SUM(CASE WHEN t.goles_favor < t.goles_contra THEN 1 ELSE 0 END) pp,
SUM(t.goles_favor) gf,
SUM(t.goles_contra) gc,
SUM(t.goles_favor - t.goles_contra) dg,
SUM(CASE 
    WHEN t.goles_favor > t.goles_contra THEN 3
    WHEN t.goles_favor = t.goles_contra THEN 1
    ELSE 0
END) pts
FROM equipos e
JOIN grupos g ON e.id_grupo = g.id_grupo
JOIN (
    SELECT p.equipo_local id_equipo, r.goles_local goles_favor, r.goles_visitante goles_contra
    FROM partidos p
    JOIN resultados r ON p.id_partido = r.id_partido
    UNION ALL
    SELECT p.equipo_visitante, r.goles_visitante, r.goles_local
    FROM partidos p
    JOIN resultados r ON p.id_partido = r.id_partido
) t ON e.id_equipo = t.id_equipo
GROUP BY g.nombre, e.id_equipo, e.nombre
ORDER BY g.nombre, pts DESC, dg DESC, gf DESC;
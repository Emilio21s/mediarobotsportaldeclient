alter table public.clinicas add column if not exists slug text unique;

update public.clinicas set slug = 'garcia', nombre_clinica='Clínica Dental García', nombre_doctor='Dr. Carlos García', paquete='Pro', fecha_inicio='2026-05-05', asesor='Emilio Sandoval', whatsapp_link='https://wa.me/50212345678', servicios_contratados='{diseno-web,seo,go-high-level}', color='#0A7C6A', iniciales='CG' where nombre_clinica='Clínica Dental García';
update public.clinicas set slug = 'sonrisas', nombre_doctor='Dra. Mariana López', paquete='Completo', fecha_inicio='2026-04-12', asesor='Emilio Sandoval', whatsapp_link='https://wa.me/50298765432', servicios_contratados='{diseno-web,seo,go-high-level,agentes-ia}', color='#5B6AF0', iniciales='SV' where nombre_clinica='Sonrisas del Valle';
update public.clinicas set slug = 'ortomax', nombre_doctor='Dr. Javier Ruiz', paquete='Starter', fecha_inicio='2026-05-02', asesor='Emilio Sandoval', whatsapp_link='https://wa.me/50211223344', servicios_contratados='{diseno-web}', color='#D97706', iniciales='OM' where nombre_clinica='OrtoMax Dental';

do $$
declare g uuid; s uuid; o uuid;
begin
  select id into g from public.clinicas where slug='garcia';
  select id into s from public.clinicas where slug='sonrisas';
  select id into o from public.clinicas where slug='ortomax';

  insert into public.looms (clinica_id, semana, fecha, titulo, duracion, tags, servicios_slugs, resumen, link_loom, visto_cliente) values
   (g,1,'2026-05-09','Kickoff: wireframe del sitio web listo','7 min','{"Diseño Web"}','{diseno-web}','{"Wireframe de 6 páginas definido y documentado","Paleta de colores elegida según identidad de la clínica","Próximo: mockup visual completo para su aprobación"}','https://loom.com/share/ejemplo1',true),
   (g,2,'2026-05-16','Mockup del sitio + auditoría SEO','9 min','{"Diseño Web","SEO"}','{diseno-web,seo}','{"Mockup de 6 páginas listo para revisión","Auditoría SEO: 10 keywords locales definidas","GMB sin categoría secundaria — corregido"}','https://loom.com/share/ejemplo2',false),
   (s,4,'2026-05-10','Agente IA conectado a WhatsApp','11 min','{"Agentes IA","Go High Level"}','{agentes-ia,go-high-level}','{"Recepcionista virtual respondiendo 24/7","Pipeline de citas conectado al CRM","Próximo: ajuste de tono y FAQ"}','https://loom.com/share/sonrisas-1',true),
   (o,1,'2026-05-09','Wireframe inicial del sitio OrtoMax','6 min','{"Diseño Web"}','{diseno-web}','{"3 páginas core definidas","Estilo limpio y dental aprobado"}','https://loom.com/share/ortomax-1',false);

  insert into public.pasos (clinica_id, servicio_slug, texto, fecha_iso, tipo) values
   (g,'diseno-web','Revisá el mockup y envianos tus comentarios','2026-05-18','accion'),
   (g,'diseno-web','Call de 20 min para resolver dudas del diseño','2026-05-20','call'),
   (g,'diseno-web','Inicio del desarrollo del sitio web','2026-05-23','hito'),
   (g,'seo','Publicación de primeros artículos SEO','2026-05-25','hito'),
   (s,'agentes-ia','Aprobar guion del agente IA','2026-05-19','accion'),
   (s,null,'Call de revisión mensual','2026-05-22','call'),
   (s,'seo','Lanzamiento campaña SEO local','2026-05-28','hito'),
   (o,'diseno-web','Enviar contenido para ''Sobre nosotros''','2026-05-17','accion'),
   (o,'diseno-web','Call de kickoff técnico','2026-05-24','call');

  insert into public.entregables (clinica_id, nombre, servicio_slug, version, status, fecha) values
   (g,'Wireframe_sitio_v1.pdf','diseno-web','v1','Aprobado','2026-05-12'),
   (g,'Mockup_sitio_v1.pdf','diseno-web','v1','Para revisión','2026-05-16'),
   (g,'Auditoria_SEO_inicial.pdf','seo','v1','Final entregado','2026-05-16'),
   (s,'Guion_agente_IA_v2.pdf','agentes-ia','v2','Para revisión','2026-05-14'),
   (s,'Reporte_SEO_abril.pdf','seo','v1','Final entregado','2026-05-05'),
   (o,'Brief_OrtoMax.pdf','diseno-web','v1','Aprobado','2026-05-08');

  insert into public.recursos (clinica_id, titulo, descripcion, tipo, categoria, link) values
   (g,'Brief inicial firmado','Documento maestro del proyecto','doc','legal','#'),
   (g,'Manual de marca','Logos, paleta y tipografías oficiales','doc','identidad','#'),
   (g,'Acceso staging del sitio','URL privada para revisar avances','link','accesos','#'),
   (g,'Credenciales Google Business','Acceso compartido al perfil GMB','credenciales','accesos','#'),
   (s,'Manual de marca Sonrisas','Identidad visual completa','doc','identidad','#'),
   (s,'Acceso CRM Go High Level','Login compartido del pipeline','credenciales','accesos','#'),
   (o,'Brief OrtoMax','Alcance y objetivos del sitio','doc','legal','#');

  insert into public.metricas (clinica_id, servicio_slug, metric_name, current_value, trend_percentage, positivo, status) values
   (g,'seo','Impresiones GMB','1,240','+18%',true,'active'),
   (g,'seo','Llamadas desde Google','32','+9',true,'active'),
   (g,'diseno-web','Visitas al staging','84','—',true,'active'),
   (g,'go-high-level','Citas agendadas','—','Pendiente setup',true,'pending_setup'),
   (s,'agentes-ia','Conversaciones IA','412','+62%',true,'active'),
   (s,'go-high-level','Citas agendadas','87','+24',true,'active'),
   (s,'seo','Impresiones GMB','3,820','+11%',true,'active'),
   (o,'diseno-web','Visitas al staging','12','—',true,'active');

  insert into public.miembros (clinica_id, nombre, rol, equipo, email, avatar_color, iniciales) values
   (g,'Emilio Sandoval','Asesor principal','media-robots','emilio@mediarobots.me','#0A7C6A','ES'),
   (g,'Lucía Pérez','Diseñadora web','media-robots',null,'#5B6AF0','LP'),
   (g,'Andrés Mora','SEO specialist','media-robots',null,'#D97706','AM'),
   (g,'Dr. Carlos García','Director clínica','cliente',null,'#B5426B','CG'),
   (g,'Sofía Méndez','Coordinadora marketing','cliente',null,'#787672','SM'),
   (s,'Emilio Sandoval','Asesor principal','media-robots','emilio@mediarobots.me','#0A7C6A','ES'),
   (s,'Pablo Núñez','Especialista IA','media-robots',null,'#5B6AF0','PN'),
   (s,'Dra. Mariana López','Directora clínica','cliente',null,'#B5426B','ML'),
   (o,'Emilio Sandoval','Asesor principal','media-robots','emilio@mediarobots.me','#0A7C6A','ES'),
   (o,'Dr. Javier Ruiz','Director clínica','cliente',null,'#D97706','JR');

  insert into public.tareas (clinica_id, servicio_slug, titulo, estado, prioridad, fecha_entrega, creado_por) values
   (g,'diseno-web','Definir wireframe del sitio','completado','alta','2026-05-12','agencia'),
   (g,'diseno-web','Mockup visual home + servicios','revision','alta','2026-05-16','agencia'),
   (g,'seo','Optimizar perfil de Google Business','en-progreso','media','2026-05-20','agencia'),
   (g,'seo','Investigación de keywords locales','en-progreso','media','2026-05-22','agencia'),
   (g,'go-high-level','Setup pipeline GHL','backlog','baja','2026-05-30','agencia'),
   (g,'diseno-web','Redactar copy de la home','backlog','media','2026-05-25','agencia'),
   (s,'agentes-ia','Ajustar guion del agente IA','revision','alta','2026-05-19','agencia'),
   (s,'seo','Reporte SEO mensual','completado','media','2026-05-05','agencia'),
   (s,'seo','Configurar campaña local','en-progreso','alta','2026-05-28','agencia'),
   (o,'diseno-web','Brief de contenidos','en-progreso','alta','2026-05-17','agencia'),
   (o,'diseno-web','Logo y manual de marca','backlog','media','2026-05-24','agencia');
end $$;
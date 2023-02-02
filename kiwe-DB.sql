/*==============================================================*/
/* Nom de SGBD :  PostgreSQL 9.x                                */
/* Date de cr�ation :  18/01/2023 16:08:10                      */
/*==============================================================*/


drop index ENTREPRISE_PK;

drop table ENTREPRISE;

drop index CONTENIR_FK;

drop index UTILISATEUR_PK;

drop table UTILISATEUR;

/*==============================================================*/
/* Table : ENTREPRISE                                           */
/*==============================================================*/
create table ENTREPRISE (
   ID_ENTREPRISE        SERIAL               not null,
   NOM_ENTREPRISE       VARCHAR(1024)        null,
   NOMBRE_CLIENTS_EN_ATTENTE INT4                 null,
   TEMPS_ATTENTE        INT4                 null,
   constraint PK_ENTREPRISE primary key (ID_ENTREPRISE)
);

/*==============================================================*/
/* Index : ENTREPRISE_PK                                        */
/*==============================================================*/
create unique index ENTREPRISE_PK on ENTREPRISE (
ID_ENTREPRISE
);

/*==============================================================*/
/* Table : UTILISATEUR                                          */
/*==============================================================*/
create table UTILISATEUR (
   ID_USER              SERIAL               not null,
   ID_ENTREPRISE        INT4                 null,
   USER_FIRSTNAME       VARCHAR(1024)        null,
   USER_LASTNAME        VARCHAR(1024)        null,
   USER_MAIL            VARCHAR(1024)        null,
   USER_MDP             VARCHAR(1024)        null,
   STATUT               VARCHAR(120)         null,
   constraint PK_UTILISATEUR primary key (ID_USER)
);

/*==============================================================*/
/* Index : UTILISATEUR_PK                                       */
/*==============================================================*/
create unique index UTILISATEUR_PK on UTILISATEUR (
ID_USER
);

/*==============================================================*/
/* Index : CONTENIR_FK                                          */
/*==============================================================*/
create  index CONTENIR_FK on UTILISATEUR (
ID_ENTREPRISE
);

alter table UTILISATEUR
   add constraint FK_UTILISAT_CONTENIR_ENTREPRI foreign key (ID_ENTREPRISE)
      references ENTREPRISE (ID_ENTREPRISE)
      on delete restrict on update restrict;


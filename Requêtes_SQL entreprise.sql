SELECT * FROM utilisateur
-- SELECT * FROM entreprise


-- *******1) associer l'utilisateur à l'entreprise consulté par ce dernier en fonction de son mail *****
-- UPDATE utilisateur  SET id_entreprise = (SELECT ID_ENTREPRISE FROM entreprise WHERE nom_entreprise = 'sociertyNew') WHERE user_mail ='tarek@koussaier'


-- ******2) si le user décide d'attendre , on ajoute 1 client en attente à la liste des clients en attente d'ou l'ID de l'entreprise
-- 		dans la table entreprise est le même que l'id de l'entreprise dans la table utilisateur ************************
-- UPDATE ENTREPRISE SET NOMBRE_CLIENTS_EN_ATTENTE = NOMBRE_CLIENTS_EN_ATTENTE + 1 WHERE ID_ENTREPRISE IN (SELECT ID_ENTREPRISE FROM UTILISATEUR WHERE USER_MAIL = 'john.doe@example.com')

-- ******** Calculer le temps d'attente en minutes pour tout les entreprises en fonction des clients en attente (EX : 2 min par client)
-- 	UPDATE entreprise SET temps_attente = ( nombre_clients_en_attente * 2 ) 
-- ******** Calculer le temps d'attente en minutes pour une entreprise selon l'ID en fonction des clients en attente (EX : 2 min par client)
-- 	UPDATE entreprise SET temps_attente = ( nombre_clients_en_attente * 2 ) WHERE id_entreprise = 6

-- ******* si le user a fini son tour, le 
-- 		nombres de clients en attente diminue de 1 ainsi que le temps d'attente diminue de 2min et il ne sera plus associé à l'entreprise en question :

-- 		//// étape 1 : le nombre de clients en attente diminue de 1 
-- 	UPDATE ENTREPRISE SET NOMBRE_CLIENTS_EN_ATTENTE = NOMBRE_CLIENTS_EN_ATTENTE - 1 WHERE ID_ENTREPRISE IN (SELECT ID_ENTREPRISE FROM UTILISATEUR WHERE USER_MAIL = 'john.doe@example.com')

-- 		//// étape 2 : le temps d'attente de l'entreprise diminue de 2min 
-- 	UPDATE entreprise SET temps_attente = (nombre_clients_en_attente * 2 - 2) WHERE ID_ENTREPRISE = (SELECT ID_ENTREPRISE FROM UTILISATEUR WHERE USER_MAIL = 'john.doe@example.com')

--      //// étape 3  : utlisateur n'est plus associé à l'entreprise : (derniere étape car on aura besoin de l'id entreprise dans les autres routes)
-- UPDATE utilisateur  SET id_entreprise = NULL WHERE user_mail ='tarek@koussaier'

-- Si le USER décide de quitter l'entreprise : 
-- UPDATE utilisateur  SET id_entreprise = NULL WHERE user_mail ='tarek@koussaier'

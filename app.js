const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const connectionString = process.env.MONGODB_URI;
const client = new MongoClient(connectionString);
const dbName = process.env.MONGODB_DBNAME;
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connecté à MongoDB');
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
    }
}

connectDB();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    console.log("Route '/' atteinte");
    res.render('index');
});
// app.get('/planning', async(req, res) => {
//     try {
//         const collection = db.collection(process.env.MONGODB_COLLECTION);
//         const appointments = await Appointment.find({}, { nom: 1, date: 1, heure: 1, typeConsultation: 1 }).sort({ date: 1, heure: 1 });
        
//         // Récupère tous les patients et sélectionne uniquement le champ `nom`
//         const patients = await collection.find({}, { projection: { nom: 1, _id: 0 } }).toArray();
        
//         // Envoie les données à la vue Pug
//         res.render('planning', { patients, appointments });
//     } catch (err) {
//         res.status(500).send('Erreur lors de la récupération des noms');
//     }
// });
// app.get('/planning', async(req, res) => {
//     try {
//         const collection = db.collection(process.env.MONGODB_COLLECTION);

//         const appointments = await collection.find({}, { nom: 1, date: 1, heure: 1, typeConsultation: 1 }).sort({ date: 1, heure: 1 }).toArray();

//         appointments.forEach(appointment => {
//             console.log(`Séances pour ${appointment.nom} ${appointment.prenom}:`);
//             appointment.sceances.forEach(seance => {
//               console.log(`- Date: ${seance.date}, heure: ${seance.heure}, type: ${seance.typeConsultation}`);
//             });
//           });

// //           app.get('/getAppointments', async (req, res) => {
// //             const startDate = new Date(req.query.start);
// //             const endDate = new Date(req.query.end);
        
// //             // Vérification des dates
// //             if (isNaN(startDate) || isNaN(endDate)) {
// //                 return res.status(400).send('Invalid date format');
// //             }
        
// //             try {
// //                 const collection = db.collection(process.env.MONGODB_COLLECTION);
                
// //                 const appointments = await collection.find({
// //                     "sceances.date": {
// //                         $gte: startDate.toISOString().split('T')[0],  // Format YYYY-MM-DD
// //                         $lte: endDate.toISOString().split('T')[0],    // Format YYYY-MM-DD
// //                     }
// //                 }).toArray();
        
// //                 appointments.forEach(appointment => {
// //                     const appointmentDateTime = new Date(`${appointment.sceances.date}T${appointment.sceances.heure}:00Z`);
// //                     console.log(`Rendez-vous: ${appointmentDateTime.toString()}, Type: ${appointment.sceances.typeConsultation}`);
// //                 });

// //                 console.log(`Date de début: ${startDate}, Date de fin: ${endDate}`);
// // console.log(`Rendez-vous trouvés: ${JSON.stringify(appointments)}`);
        
// //                 res.json({ appointments });
// //             } catch (err) {
// //                 console.error(err);
// //                 res.status(500).send('Erreur lors de la récupération des rendez-vous');
// //             }
// //         });
// app.get('/getAppointments', async (req, res) => {
//     const startDate = new Date(req.query.start);
//     const endDate = new Date(req.query.end);

//     // Vérification des dates
//     if (isNaN(startDate) || isNaN(endDate)) {
//         return res.status(400).send('Invalid date format');
//     }

//     try {
//         const collection = db.collection(process.env.MONGODB_COLLECTION);
        
//         // Récupération des rendez-vous
//         const appointments = await collection.find({
//             "sceances.date": {
//                 $gte: startDate.toISOString().split('T')[0],
//                 $lte: endDate.toISOString().split('T')[0],
//             }
//         }).toArray();
//         console.log("------ appointenements ----------------")
//         console.log(startDate.toISOString().split('T')[0])
//         console.log(endDate.toISOString().split('T')[0])
//         console.log("------ appointenements ----------------")

//         // Traitement des rendez-vous récupérés
//         const formattedAppointments = appointments.flatMap(appointment => {
//             return appointment.sceances.map(sceance => {
//                 const date = sceance.date; // Format: YYYY-MM-DD
//                 const time = sceance.heure; // Format: HH:mm

//                 // Log des valeurs pour débogage
//                 console.log(`Processing appointment - date: ${date}, time: ${time}`);

//                 // Vérification de l'existence des valeurs
//                 if (!date || !time) {
//                     console.error('Date or time is missing for appointment:', sceance);
//                     return null; // Retourner null si la date ou l'heure est manquante
//                 }

//                 // Créez un objet Date en utilisant le bon format
//                 const appointmentDateTime = new Date(`${date}T${time}:00`); // UTC
//                 console.log(`appointmentDateTime: ${appointmentDateTime}, isValid: ${!isNaN(appointmentDateTime)}`);

//                 // Vérifiez que appointmentDateTime est valide
//                 if (isNaN(appointmentDateTime.getTime())) {
//                     console.error('Invalid date for appointment:', sceance);
//                     return null; // Retourner null si la date est invalide
//                 }

//                 // Vérification de la conversion locale
//                 const localDate = appointmentDateTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
//                 console.log(`Local date: ${localDate}`);

//                 const [dateString, timeString] = localDate.split(',');

//                 // Vérification de la définition des variables
//                 if (!dateString || !timeString) {
//                     console.error('Date or time is undefined for appointment:', localDate);
//                     return null; // Retourner null si date ou time est indéfini
//                 }

//                 // Nettoyage des chaînes
//                 return {
//                     nom: appointment.nom || 'Inconnu',
//                     prenom: appointment.prenom || 'Inconnu',
//                     date: dateString.trim(),
//                     heure: timeString.trim(),
//                     type: sceance.typeConsultation || 'Inconnu',
//                 };
//             }).filter(Boolean); // Filtrer les rendez-vous nuls
//         });

//         console.log("Rendez-vous trouvés:", formattedAppointments);

//         // Envoi de la réponse au client
//         res.json({ appointments: formattedAppointments });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Erreur lors de la récupération des rendez-vous');
//     }
// });

//         // Récupère tous les patients et sélectionne uniquement le champ `nom`
//         const patients = await collection.find({}, { projection: { nom: 1, _id: 0 } }).toArray();
        
//         // Envoie les données à la vue Pug
//         res.render('planning', { patients,appointments });
//     } catch (err) {
//         res.status(500).send('Erreur lors de la récupération des noms');
//     }
// });
// app.get('/documents', (req, res) => {
//     console.log("Route '/documents' atteinte");
//     res.render('documents');
// });
// app.get('/declarationPaiementsAnnuel', (req, res) => {
//     console.log("Route '/declarationPaiementsAnnuel' atteinte");
//     res.render('declarationPaiementsAnnuel');
// });

// app.post('/declarationPaiementsAnnuel', async (req, res) => {
//     var paiementsAnnuel = {
//         montantChambreSyndicale: req.body.montantChambreSyndicale,
//         montantResalib: req.body.montantResalib,
//         montantAssurancePro: req.body.montantAssurancePro,
//         dateMaJ:req.body.dateMaj
//     };  

//     try {
//         const collection = db.collection(process.env.MONGODB_COLLECTION2);
        
//         // Mettez à jour le document existant ou insérez un nouveau document s'il n'existe pas
//         const result = await collection.updateOne(
//             {}, // Critère de recherche (vide pour sélectionner le premier document)
//             { $set: paiementsAnnuel }, // Met à jour les champs avec les nouvelles valeurs
//             { upsert: true } // Crée un nouveau document si aucun document ne correspond
//         );

//         res.redirect('recapitulatifPaiementsAnnuel'); // Redirection avec un paramètre de succès
//     } catch (err) {
//         console.error("Erreur lors de l'ajout des paiements annuels:", err);
//         res.status(500).send("Erreur lors de l'ajout des paiements annuels");
//     }
// });

app.get('/planning', async (req, res) => {
    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);

        // Récupération des rendez-vous avec projection des champs nécessaires
        const appointments = await collection.find({}, { projection: { nom: 1, prenom: 1, sceances: 1 } })
            .sort({ 'sceances.date': 1, 'sceances.heure': 1 })
            .toArray();

        // Traitement des rendez-vous pour les logs
        appointments.forEach(appointment => {
            console.log(`Séances pour ${appointment.nom} ${appointment.prenom}:`);
            appointment.sceances.forEach(seance => {
                console.log(`- Date: ${seance.date}, heure: ${seance.heure}, type: ${seance.typeConsultation}`);
            });
        });

        // Récupère tous les patients et sélectionne uniquement le champ `nom` et `prenom`
        const patients = await collection.find({}, { projection: { nom: 1, prenom: 1, _id: 0 } }).toArray();

        // Envoie des données à la vue Pug
        res.render('planning', { patients, appointments });
    } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        res.status(500).send('Erreur lors de la récupération des noms ou des rendez-vous');
    }
});

app.get('/getAppointments', async (req, res) => {
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);

    // Vérification des dates
    if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).send('Invalid date format');
    }

    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);

        // Récupération des rendez-vous
        const appointments = await collection.find({
            "sceances.date": {
                $gte: startDate.toISOString().split('T')[0],
                $lte: endDate.toISOString().split('T')[0],
            }
        }).toArray();

        // Traitement des rendez-vous récupérés
        const formattedAppointments = appointments.flatMap(appointment => {
            return appointment.sceances.map(sceance => {
                const date = sceance.date;
                const time = sceance.heure;

                if (!date || !time) {
                    console.error('Date or time is missing for appointment:', sceance);
                    return null;
                }

                const appointmentDateTime = new Date(`${date}T${time}:00`);
                if (isNaN(appointmentDateTime.getTime())) {
                    console.error('Invalid date for appointment:', sceance);
                    return null;
                }

                const localDate = appointmentDateTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
                const [dateString, timeString] = localDate.split(',');

                return {
                    nom: appointment.nom || 'Inconnu',
                    prenom: appointment.prenom || 'Inconnu',
                    date: dateString.trim(),
                    heure: timeString.trim(),
                    type: sceance.typeConsultation || 'Inconnu',
                };
            }).filter(Boolean);
        });

        res.json({ appointments: formattedAppointments });
    } catch (err) {
        console.error("Erreur lors de la récupération des rendez-vous :", err);
        res.status(500).send('Erreur lors de la récupération des rendez-vous');
    }
});

app.get('/nouveauPatient', (req, res) => {
    console.log("Route '/nouveauPatient' atteinte");
    res.render('nouveauPatient');    
});

app.post('/nouveauPatient', async (req, res) => {
    const patient = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email:req.body.email,
        telephone:req.body.telephone,
        objetVisite:req.body.objetVisite,
        etatDeSante:req.body.etatDeSante,
        choixEtatDeSante:req.body.choixEtatDeSante,
        traitementMedicalParticulier:req.body.traitementMedicalParticulier,
        douleurSpecifique:req.body.douleurSpecifique,
        choixdouleurSpecifique:req.body.choixdouleurSpecifique,
        troubleDuSommeil:req.body.troubleDuSommeil,
        choixTroubleDuSommeil:req.body.choixTroubleDuSommeil,
        troubleAlimentation:req.body.troubleAlimentation,
        choixTroubleAlimentation:req.body.choixTroubleAlimentation,
        situationFamilliale:req.body.situationFamilliale,
        choixSituationFamilliale:req.body.choixSituationFamilliale,
        situationProfessionnelle:req.body.situationProfessionnelle,
        choixSituationProfessionnelle:req.body.choixSituationProfessionnelle,
        situationSociale:req.body.situationSociale,
        choixSituationSociale:req.body.choixSituationSociale,
        aversions:req.body.aversions,
        choixAversions:req.body.choixAversions,
        loisirs:req.body.loisirs,
        ObjetsLieuxPrivilegies:req.body.ObjetsLieuxPrivilegies,
        definitionObjectif:req.body.definitionObjectif,
        resourcesSituationnelles:req.body.resourcesSituationnelles,
        indicateursDeReussite:req.body.indicateursDeReussite,
        besoins:req.body.besoins,
        ressources:req.body.ressources,
        contraintes:req.body.contraintes,
        aversionsResume:req.body.aversionsResume,
        nombresSceances:req.body.nombresSceances,
        protocoleType:req.body.protocoleType
    };

    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);
        await collection.insertOne(patient);
        res.redirect('/?success=true'); // Redirection avec un paramètre de succès
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la tâche :', err);
        res.status(500).send('Erreur lors de l\'ajout de la tâche');
    }
});
app.get('/patients', async (req, res) => {
    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);
        
        // Récupère tous les patients et sélectionne uniquement le champ `nom`
        const patients = await collection.find({}, { projection: { nom: 1, _id: 0 } }).toArray();
        
        // Envoie les données à la vue Pug
        res.render('patients', { patients });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des noms');
    }
});
app.get('/suiviPatient', async (req, res) => {
    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);
        
        // Récupère tous les patients et sélectionne uniquement le champ `nom`
        const patients = await collection.find({}, { projection: { nom: 1, _id: 0 } }).toArray();
        
        // Envoie les données à la vue Pug
        res.render('suiviPatient', { patients });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des noms');
    }
});

app.get('/recapitulatifPaiementsAnnuel', async (req, res) => {
    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION2);
        
        // Récupère le document existant dans la collection
        var paiementsAnnuel = await collection.findOne({}); 
        console.log("dans recap "+paiementsAnnuel.dateMaJ)
        const dateComplete = paiementsAnnuel.dateMaJ.split("-")
        const date=`${dateComplete[2]}/${dateComplete[1]}/${dateComplete[0]}`
        paiementsAnnuel.dateMaJ=date 

        // Vérifiez si des données ont été trouvées
        if (!paiementsAnnuel) {
            return res.status(404).send('Aucun paiement annuel trouvé');
        }
        // Envoie les données à la vue Pug
        res.render('recapitulatifPaiementsAnnuel', { paiementsAnnuel });
    } catch (err) {
        console.error('Erreur lors de la récupération des paiements annuels:', err);
        res.status(500).send('Erreur lors de la récupération des paiements annuels');
    }
});

app.get('/paiement', async (req, res) => {
    const aujourdHui = new Date();
    const annee = aujourdHui.getFullYear();
    const mois = String(aujourdHui.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const jour = String(aujourdHui.getDate()).padStart(2, '0');
    const dateAujourdHui = `${annee}-${mois}-${jour}`;

    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);
        
        // Récupère tous les patients et sélectionne uniquement le champ `nom`
        const patients = await collection.find({}, { projection: { nom: 1, _id: 0 } }).toArray();
        
        // Envoie les données à la vue Pug
        res.render('paiement', { patients,dateAujourdHui });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des noms');
    }
});

app.post('/votre-action', async (req, res) => {
    try {
        const nomPatient = req.body.nomPatient;
        const patient = await db.collection(process.env.MONGODB_COLLECTION).findOne({ nom: nomPatient });

        if (patient) {
            res.render('patients', { patient, patients: await db.collection(process.env.MONGODB_COLLECTION).find().toArray() });
        } else {
            res.render('patients', { error: "Patient non trouvé", patients: await db.collection(process.env.MONGODB_COLLECTION).find().toArray() });
        }
    } catch (err) {
        console.error("Erreur lors de la récupération du patient:", err);
        res.render('index', { error: "Une erreur est survenue", patients: [] });
    }
});

app.post('/votre-actionII', async (req, res) => {
    try {
        const nomPatient = req.body.nomPatient;
        const patient = await db.collection(process.env.MONGODB_COLLECTION).findOne({ nom: nomPatient });

        if (patient) {
            res.render('suiviPatient', { patient, patients: await db.collection(process.env.MONGODB_COLLECTION).find().toArray() });
        } else {
            res.render('suiviPatient', { error: "Patient non trouvé", patients: await db.collection(process.env.MONGODB_COLLECTION).find().toArray() });
        }
    } catch (err) {
        console.error("Erreur lors de la récupération du patient:", err);
        res.render('index', { error: "Une erreur est survenue", patients: [] });
    }
});

app.post('/votre-actionIII', async (req, res) => {
    try {
        const nomPatient = req.body.nomPatient;
        const patient = await db.collection(process.env.MONGODB_COLLECTION).findOne({ nom: nomPatient });

        if (patient) {
            res.render('comptabilite', { patient, patients: await db.collection(process.env.MONGODB_COLLECTION).find().toArray() });
        } else {
            res.render('comptabilite', { error: "Patient non trouvé", patients: await db.collection(process.env.MONGODB_COLLECTION).find().toArray() });
        }
    } catch (err) {
        console.error("Erreur lors de la récupération du patient:", err);
        res.render('index', { error: "Une erreur est survenue", patients: [] });
    }
});

app.post('/paiement', async (req, res) => {
    const patientId = req.body.patientId

    const paiement = {
        montant: req.body.montant,
        datePaiement: req.body.datePaiement ||new Date(), 
        modePaiement: req.body.modePaiement,
        // statutPaiement: req.body.statutPaiement || "Effectué",
        commentaire: req.body.commentaire || "",
    };

    console.log("Ajout de paiement:", paiement); // Débogage

    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);
        
        // Ajout du paiement au tableau `paiements` du patient correspondant
        const result = await collection.updateOne(
            { nom: patientId }, // Condition pour trouver le bon document
            { $push: { paiements: paiement } } // Ajoute le paiement au tableau `paiements`
        );
        if (result.modifiedCount === 0) {
            console.log("Aucun document modifié, assurez-vous que le patient existe.");
            return res.status(404).send("Patient non trouvé.");
        }
        console.log("Paiement effectué:", result);
        res.redirect('/paiement'); // Redirige vers la comptabilité après l'ajout
    } catch (error) {
        console.error("Erreur lors de l'ajout du paiement:", error);
        res.status(500).send("Erreur lors de l'ajout du paiement");
    }
});

app.post('/ajoutRendezVous', async (req, res) => {
    const patientId = req.body.nomPatientAjoutRendezVous

    const sceance = {
        date: req.body.dateJour,
        heure: req.body.dateHeure, 
        typeConsultation: req.body.typeConsultation,
    };

    console.log("Ajout de consultation:", sceance); // Débogage

    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);
        
        // Ajout du paiement au tableau `paiements` du patient correspondant
        const result = await collection.updateOne(
            { nom: patientId }, // Condition pour trouver le bon document
            { $push: { sceances: sceance } } // Ajoute le paiement au tableau `paiements`
        );
        if (result.modifiedCount === 0) {
            console.log("Aucun document modifié, assurez-vous que le patient existe.");
            return res.status(404).send("Patient non trouvé.");
        }
        console.log("consultation ajoutée:", result);
        res.redirect('/planning'); // Redirige vers la comptabilité après l'ajout
    } catch (error) {
        console.error("Erreur lors de l'ajout du rendez-vous:", error);
        res.status(500).send("Erreur lors de l'ajout du rendez-vous");
    }
});

app.post('/ajoutTachePerso', async (req, res) => {
    const tache = {
        tachePerso: req.body.tachePerso,
        date: req.body.dateJourTachePerso,
        heure: req.body.dateHeureTachePerso, 
    };

    console.log("Ajout de tâche perso:", tache); // Débogage

    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION3);

        // Essayer d'ajouter la tâche dans le tableau `taches`
        const result = await collection.insertOne(tache);

        // Vérifie le résultat de la mise à jour
        if (result.modifiedCount === 0 && result.upsertedCount === 0) {
            console.log("Aucun document modifié ou inséré.");
            return res.status(404).send("Erreur lors de l'ajout de la tâche.");
        }

        console.log("Tâche ajoutée:", result);
        res.redirect('/planning'); // Redirige vers la page souhaitée
    } catch (error) {
        console.error("Erreur lors de l'ajout de tâche:", error);
        res.status(500).send("Erreur lors de l'ajout de la tâche");
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
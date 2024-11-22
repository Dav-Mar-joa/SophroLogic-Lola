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
app.get('/planning', (req, res) => {
    console.log("Route '/planning' atteinte");
    res.render('planning');
});
// app.get('/suiviPatient', (req, res) => {
//     console.log("Route '/suiviPatient' atteinte");
//     res.render('suiviPatient');
// });
// app.get('/comptabilite', (req, res) => {
//     console.log("Route '/comptabilite' atteinte");
//     res.render('comptabilite');
// });
app.get('/documents', (req, res) => {
    console.log("Route '/documents' atteinte");
    res.render('documents');
});
app.get('/declarationPaiementsAnnuel', (req, res) => {
    console.log("Route '/declarationPaiementsAnnuel' atteinte");
    res.render('declarationPaiementsAnnuel');
});
// app.get('/recapitulatifPaiementsAnnuel', (req, res) => {
//     console.log("Route '/recapitulatifPaiementsAnnuel' atteinte");
//     res.render('recapitulatifPaiementsAnnuel');
// });

// app.post('/declarationPaiementsAnnuel', async (req, res) => {
//     const paiementsAnnuel = {
//         montantChambreSyndicale: req.body.montantChambreSyndicale,
//         montantResalib: req.body.montantResalib,
//         montantAssurancePro: req.body.montantAssurancePro  
//     };
//     try {
//         const collection = db.collection(process.env.MONGODB_COLLECTION2);
//         await collection.insertOne(paiementsAnnuel);
//         res.redirect('/?success=true'); // Redirection avec un paramètre de succès
//     } catch (err) {
//         console.error("Erreur lors de l'ajout des paiements annuels:", err);
//         res.status(500).send("Erreur lors de l'ajout des paiements annuels");
//     }
// });

app.post('/declarationPaiementsAnnuel', async (req, res) => {
    // const dateMaj = req.body.dateMaj; // Récupération de la date
    // console.log(dateMaJ)

    // // Vérification que dateMaj est défini et a la bonne longueur
    // if (dateMaj && dateMaj.length === 10) {
    //     const day = dateMaj.substring(8, 10);   // Extrait les caractères de l'index 8 à 10 (DD)
    //     const month = dateMaj.substring(5, 7);  // Extrait les caractères de l'index 5 à 7 (MM)
    //     const year = dateMaj.substring(0, 4);   // Extrait les caractères de l'index 0 à 4 (YYYY)
        
    //     // Format de date final
    //     const date = `${day}/${month}/${year}`;
        
    //     console.log(date); // Affichage de la date au format DD/MM/YYYY
    // } else {
    //     console.error("La date fournie n'est pas au format attendu");
    // }
    var paiementsAnnuel = {
        montantChambreSyndicale: req.body.montantChambreSyndicale,
        montantResalib: req.body.montantResalib,
        montantAssurancePro: req.body.montantAssurancePro,
        dateMaJ:req.body.dateMaj
    };
    // console.log(paiementsAnnuel.dateMaJ)
    // const day = paiementsAnnuel.dateMaj.substring(8, 10);   
    // // Extrait les caractères de l'index 8 à 10 (DD)
    //     const month = paiementsAnnuel.dateMaj.substring(5, 7);  
    // // Extrait les caractères de l'index 5 à 7 (MM)
    //     const year = paiementsAnnuel.dateMaj.substring(0, 4);
    //     const date = `${day}/${month}/${year}`; 

    // paiementsAnnuel.dateMaJ=date  
    // console.log ("paiementsAnnuel.dateMaJ"+paiementsAnnuel.dateMaJ)   

    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION2);
        
        // Mettez à jour le document existant ou insérez un nouveau document s'il n'existe pas
        const result = await collection.updateOne(
            {}, // Critère de recherche (vide pour sélectionner le premier document)
            { $set: paiementsAnnuel }, // Met à jour les champs avec les nouvelles valeurs
            { upsert: true } // Crée un nouveau document si aucun document ne correspond
        );

        res.redirect('/?success=true'); // Redirection avec un paramètre de succès
    } catch (err) {
        console.error("Erreur lors de l'ajout des paiements annuels:", err);
        res.status(500).send("Erreur lors de l'ajout des paiements annuels");
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
// app.get('/patients', (req, res) => {
//     console.log("Route '/patients' atteinte");
//     res.render('patients');
// });
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
// app.post('/ajouterPaiement', async (req, res) => {
//     // Extraction des valeurs du corps de la requête
//     const patientId = req.body.patientId || "lola"; // Utiliser une valeur par défaut pour le débogage
//     const montant = req.body.montant || 100; // Utiliser une valeur par défaut pour le débogage

//     const paiement = {
//         patientId: patientId,
//         montant: montant,
//         datePaiement: req.body.datePaiement, // Assurez-vous que cette valeur est passée dans la requête
//         modePaiement: req.body.modePaiement,
//         statutPayement: req.body.statutPayement,
//         commentaire: req.body.commentaire,
//     };

//     console.log("Ajout de paiement:", paiement); // Débogage

//     try {
//         const collection = db.collection(process.env.MONGODB_COLLECTION);
        
//         // Ajout du paiement dans la collection
//         const result = await collection.insertOne(paiement);
//         console.log("Paiement effectué:", result.insertedId); // Log du paiement effectué

//         // Redirection ou réponse appropriée
//         res.redirect('/comptabilite'); // Redirige vers la comptabilité après l'ajout
//     } catch (error) {
//         console.error("Erreur lors de l'insertion :", error);
//         res.status(500).send("Erreur lors de l'ajout du paiement");
//     }
// });

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

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
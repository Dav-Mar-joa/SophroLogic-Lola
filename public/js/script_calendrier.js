const days = document.querySelectorAll('.day');
const currentDate = new Date();
let currentWeekStartDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
console.log('Fichier JavaScript chargé');

function updateCalendarDates() {
  let date = new Date(currentWeekStartDate);
  console.log('Mise à jour des dates du calendrier :', currentWeekStartDate);

  days.forEach(day => {
    const dateElement = day.querySelector('.date');
    dateElement.textContent = date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    console.log('Date affichée:', dateElement.textContent); // Vérifier les dates affichées
    date.setDate(date.getDate() + 1);
  });

  // Récupérer les rendez-vous pour la semaine actuelle
  fetchAppointmentsForWeek(currentWeekStartDate);
}

function fetchAppointmentsForWeek(startDate) {
  // Calculer la fin de la semaine
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  console.log('Récupération des rendez-vous pour la période:', {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  });

  // Faire une requête au serveur pour obtenir les rendez-vous
  fetch(`/getAppointments?start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau lors de la récupération des rendez-vous');
      }
      return response.json();
    })
    .then(data => {
      console.log('Données des rendez-vous reçues:', data); // Vérifiez les données reçues
      renderAppointments(data.appointments);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des rendez-vous :', error);
    });
}

function renderAppointments(appointments) {
  console.log('Rendez-vous à afficher:', appointments); // Vérifiez les rendez-vous à afficher

  // Réinitialiser les rendez-vous affichés
  const patientListElements = document.querySelectorAll('.patient-list');
  patientListElements.forEach(patientList => {
    patientList.innerHTML = ''; // Vider les anciens rendez-vous
  });

  // Afficher les nouveaux rendez-vous
  appointments.forEach(appointment => {
    appointment.sceances.forEach(seance => {
      const seanceDate = new Date(seance.date);
      // Calculer le jour de la semaine pour la séance
      const dayIndex = seanceDate.getDay() === 0 ? 6 : seanceDate.getDay() - 1; // Ajuster pour Lundi-Dimanche

      // Trouver l'élément du jour correspondant et ajouter le rendez-vous
      const patientList = patientListElements[dayIndex];
      const patientItem = document.createElement('div');
      patientItem.classList.add('patient-item');
      patientItem.innerHTML = `<span>${appointment.nom} ${appointment.prenom}</span> <span>${seance.heure}</span> <span>${seance.typeConsultation === 'presentiel' ? '🪑' : '💻'}</span>`;
      patientList.appendChild(patientItem);
      console.log(`Ajout du rendez-vous : ${appointment.nom} ${appointment.prenom} à ${seance.heure} (${seance.typeConsultation})`);
    });
  });
}

// Gestion des événements pour naviguer entre les semaines
document.getElementById('prev-week').addEventListener('click', () => {
  currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
  console.log('Semaine précédente');
  updateCalendarDates();
});

document.getElementById('next-week').addEventListener('click', () => {
  currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
  console.log('Semaine suivante');
  updateCalendarDates();
});

// Initialiser le calendrier
updateCalendarDates();

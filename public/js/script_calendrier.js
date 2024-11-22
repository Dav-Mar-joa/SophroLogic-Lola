const days = document.querySelectorAll('.day');
      const currentDate = new Date();
      let currentWeekStartDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));

      function updateCalendarDates() {
        let date = new Date(currentWeekStartDate);

        days.forEach(day => {
          const dateElement = day.querySelector('.date');
          dateElement.textContent = date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
          date.setDate(date.getDate() + 1);
        });
      }

      document.getElementById('prev-week').addEventListener('click', () => {
        currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
        updateCalendarDates();
      });

      document.getElementById('next-week').addEventListener('click', () => {
        currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
        updateCalendarDates();
      });

      updateCalendarDates();
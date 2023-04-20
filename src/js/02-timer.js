import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startButton = document.querySelector('[data-start]');
const timerDays = document.querySelector('[data-days]');
const timerHours = document.querySelector('[data-hours]');
const timerMinutes = document.querySelector('[data-minutes]');
const timerSeconds = document.querySelector('[data-seconds]');
const currentTime = new Date();

startButton.disabled = false;
const dateInput = document.querySelector('#datetime-picker');

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

flatpickr(dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const now = new Date();
    const selectedTime = selectedDates[0];
    if (selectedTime.getTime() >= now.getTime()) {
      const day = selectedTime.getDate();
      const hour = selectedTime.getHours();
      const minute = selectedTime.getMinutes();
      const second = selectedTime.getSeconds();
    } else {
      Notiflix.Notify.warning('Please choose a date in the future');
    }
  },
});

const flatpickrInstance = dateInput._flatpickr;

startButton.addEventListener('click', () => {
  const selectedTime = flatpickrInstance.selectedDates[0];
  if (selectedTime) {
    const intervalId = setInterval(() => {
      const remainingTime = selectedTime.getTime() - new Date().getTime();
      const { days, hours, minutes, seconds } = convertMs(remainingTime);
      timerDays.textContent = days.toString().padStart(2, 0);
      timerHours.textContent = hours.toString().padStart(2, 0);
      timerMinutes.textContent = minutes.toString().padStart(2, 0);
      timerSeconds.textContent = seconds.toString().padStart(2, 0);
      if (remainingTime < 0) {
        clearInterval(intervalId);
      }
    }, 1000);
  }
});

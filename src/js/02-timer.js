import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startButton = document.querySelector('[data-start]');
const timerDays = document.querySelector('[data-days]');
const timerHours = document.querySelector('[data-hours]');
const timerMinutes = document.querySelector('[data-minutes]');
const timerSeconds = document.querySelector('[data-seconds]');
const currentTime = new Date();

startButton.disabled = true;
let timerRunning = false;
const dateInput = document.querySelector('#datetime-picker');

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  let remainingTime = ms;

  if (remainingTime < 0) {
    remainingTime = 0;
  }

  // Remaining days
  const days = Math.floor(remainingTime / day);
  // Remaining hours
  const hours = Math.floor((remainingTime % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((remainingTime % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor(
    (((remainingTime % day) % hour) % minute) / second
  );
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
    if (selectedTime && selectedTime.getTime() >= now.getTime()) {
      const day = selectedTime.getDate();
      const hour = selectedTime.getHours();
      const minute = selectedTime.getMinutes();
      const second = selectedTime.getSeconds();
      startButton.disabled = false;
    } else {
      Notiflix.Notify.warning('Please choose a date in the future');
      startButton.disabled = true;
    }
  },
});

const flatpickrInstance = dateInput._flatpickr;

startButton.addEventListener('click', () => {
  const selectedTime = flatpickrInstance.selectedDates[0];
  if (selectedTime && !timerRunning) {
    startButton.disabled = true;
    timerRunning = true;
    const intervalId = setInterval(() => {
      const remainingTime = selectedTime.getTime() - new Date().getTime();
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        timerDays.textContent = '00';
        timerHours.textContent = '00';
        timerMinutes.textContent = '00';
        timerSeconds.textContent = '00';
        startButton.disabled = true;
      } else {
        const { days, hours, minutes, seconds } = convertMs(remainingTime);
        timerDays.textContent = days.toString().padStart(2, '0');
        timerHours.textContent = hours.toString().padStart(2, '0');
        timerMinutes.textContent = minutes.toString().padStart(2, '0');
        timerSeconds.textContent = seconds.toString().padStart(2, '0');
      }
    }, 1000);
  }
});

const form = document.querySelector('.form');
import Notiflix from 'notiflix';

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const amount = parseInt(form.elements['amount'].value);
  const step = parseInt(form.elements['step'].value);
  let delay = parseInt(form.elements['delay'].value);

  function createPromise(position, delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shouldResolve = Math.random() > 0.3;
        if (shouldResolve) {
          resolve({ position, delay });
        } else {
          reject({ position, delay });
        }
      }, delay);
    });
  }

  for (let i = 1; i <= amount; i++) {
    createPromise(i, delay)
      .then(result =>
        Notiflix.Notify.success(
          `✅ Fulfilled promise ${result.position} in ${result.delay}ms`
        )
      )
      .catch(result =>
        Notiflix.Notify.failure(
          `❌ Rejected promise ${result.position} in ${result.delay}ms`
        )
      );
    delay += step;
  }
});

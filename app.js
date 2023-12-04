/*const guardarDatos = {
    nombre: "Luis",
    edad: 22,
    correo: null,
    telefono: 1234567890,
}
  
localStorage.setItem("datos", JSON.stringify(guardarDatos));
console.log(JSON.parse(localStorage.getItem("datos")));

//insertar un boton en el contenedor que solicite notificaciones

const button = document.getElementById('button');

button.addEventListener('click', () => {
    Notification.requestPermission()
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })
});

navigator.setAppBadge(42).then(() => {
  console.log("The badge was added");
}).catch(e => {
  console.error("Error displaying the badge", e);
});*/

//Push Notifications

const applicationServerPublicKey = 'BC_Cl2w7p7FWty_GxlWeJPBS4I88uGTKq3dp9m85adPqXGIqIK6BB2w71jPknlYvIs1tt05WlEB3nCDuXO2hVs4';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }
  pushButton.disabled = false;
}

navigator.serviceWorker.register('./sw.js')
.then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initializeUI();
})

function updateSubscriptionOnServer(subscription) {
  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');
  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    console.log(subscriptionJson.textContent);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push are supported');

  navigator.serviceWorker.register('./sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);
    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
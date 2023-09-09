const getUserPosition = () => {
  const successCallback = (position) => {
    console.log(position);
    setLocalStorage('position', position);
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
}

const getLocalStorage = (key) => {
  return localStorage.getItem(key);
}

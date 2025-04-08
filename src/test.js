

  const axios = require('axios');

  const apiUrl = 'http://localhost:8000/users'; // Replace with your JSON server endpoint
  
  const userObject = {
    firstname: 'John',
    lastname: 'Doe',
  };
  
  axios.post(apiUrl, userObject)
    .then(response => {
      console.log('User added successfully:', response.data);
    })
    .catch(error => {
      console.error('Error adding user:', error);
    });
  
const apiHost = process.env.REACT_APP_API_HOST; // Centralize the API host

// Function to handle GET requests
export async function get(url) {
  try {
    const response = await fetch(`${apiHost}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Assuming server response is JSON
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
}

// Function to handle POST requests
export async function post(url, data) {
  try {
    let token = localStorage.getItem('token') || '';

    let reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
    };
    const response = await fetch(`${apiHost}${url}`, reqOptions);

    const result = await response.json();  // Get JSON response regardless of status

    if (!response.ok) {
      // This will handle HTTP errors like 422, attaching the status and message for the front end
      return { status: response.status, ...result };
    } else {
      // Successful response, return data with status
      return { status: response.status, ...result };
    }
    
  } catch (error) {
    console.error('POST request error:', error);
    throw error; // You can modify this part to handle JavaScript errors differently if you like
  }
}

export async function put(url, data) {
  try {
    let token = localStorage.getItem('token') || '';

    let reqOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
    };
    const response = await fetch(`${apiHost}${url}`, reqOptions);

    const result = await response.json();  // Get JSON response regardless of status

    if (!response.ok) {
      // This will handle HTTP errors like 422, attaching the status and message for the front end
      return { status: response.status, ...result };
    } else {
      // Successful response, return data with status
      return { status: response.status, ...result };
    }
    
  } catch (error) {
    console.error('POST request error:', error);
    throw error; // You can modify this part to handle JavaScript errors differently if you like
  }
}


export async function deleteData(url, data) {
  try {
    let token = localStorage.getItem('token') || '';

    let reqOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
    };
    const response = await fetch(`${apiHost}${url}`, reqOptions);

    const result = await response.json();  // Get JSON response regardless of status

    if (!response.ok) {
      // This will handle HTTP errors like 422, attaching the status and message for the front end
      return { status: response.status, ...result };
    } else {
      // Successful response, return data with status
      return { status: response.status, ...result };
    }
    
  } catch (error) {
    console.error('POST request error:', error);
    throw error; // You can modify this part to handle JavaScript errors differently if you like
  }
}
// src/stores/authStore.js
import { makeAutoObservable } from 'mobx';
import { message } from 'antd';


class AuthStore {
  isAuthenticated = false;
  users = [];

  constructor() {
    makeAutoObservable(this);
  }

  login() {
    // Simulate a login, you would replace this with your actual authentication logic
    this.isAuthenticated = true;
    async function postData(url = "", data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }
    /* postData("http://localhost:3006/users/list", { user_id: 1 }).then((res) => {
        console.log(res.data); // JSON data parsed by `data.json()` call
        if(res.status === 200){
          console.log("tyuiopghjkl========")
          if(res.data && res.data.length){
            this.users = res.data;
            this.isAuthenticated = true;
          }
        } else{
          message.error('Login failed. Please check your credentials.');
        }
      }); */
  }

  logout() {
    // Simulate a logout
    this.isAuthenticated = false;
    this.users = [];
  }

  addUser(user) {
    // Simulate adding a new user
    this.users.push(user);
  }

}

const authStore = new AuthStore();
export default authStore;

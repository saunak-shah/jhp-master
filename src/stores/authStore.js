// src/stores/authStore.js
import { makeAutoObservable } from 'mobx';
import { message } from 'antd';
import Cookies from 'js-cookie'; // Import js-cookie library


class AuthStore {
  isAuthenticated = false;
  users = [];
  user = null;

  apiHost = 'http://localhost:3006/api/'

  constructor() {
    makeAutoObservable(this);
    this.checkAuthentication();
  }

  login(userData) {
    // Simulate a login, you would replace this with your actual authentication logic
    this.isAuthenticated = true;
    this.user = userData;
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data in localStorage
  }

  logout() {
    // Simulate a logout
    this.isAuthenticated = false;
    this.user = null;
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.clear();
    Cookies.remove('token'); 
  }

  checkAuthentication() {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const storedUser = localStorage.getItem("user");

    this.isAuthenticated = isAuthenticated;
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  addUser(user) {
    // Simulate adding a new user
    // this.users.push(user);
  }

}

const authStore = new AuthStore();
export default authStore;

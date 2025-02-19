import { makeAutoObservable } from "mobx";
import { getMonthNumber, getStartAndEndDate } from "../global/helper";
import moment from 'moment';

class AttendanceStore {
  attendanceDetails = [];
  isDrawerOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAttendanceDetails(item) {
    const apiHost = process.env.REACT_APP_API_HOST;
    let current = moment(); // Setting to September 2024 for the given scenario
    const monthYear = current.format("MMM YYYY");
    const [monthName, year] = monthYear.split(" ");
    const month = getMonthNumber(monthName);
    const { startDate, endDate } = getStartAndEndDate(year, month); // February 2024
    const apiUrl = `${apiHost}/api/attendance-dates?lowerDateLimit=${startDate}&upperDateLimit=${endDate}&selectedStudent=${item.student_id}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
      },
    });

    if (response.ok) {
      const res = await response.json();
      const checked_dates = res.data?.staff[0]?.checked_dates || [];

      const formattedDates = checked_dates.reduce((acc, date) => {
        acc.push({ date: date.split("/").reverse().join("/") });
        return acc;
      }, []);

      this.attendanceDetails = formattedDates;
    }
  }

  openDrawer(item) {
    this.fetchAttendanceDetails(item);
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }
}

const attendanceStore = new AttendanceStore();
export default attendanceStore;

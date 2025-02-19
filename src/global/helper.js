const moment = require('moment');

export const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  export const getStartAndEndDate = (year, month) => {
    const startDate = moment(`${year}-${month}`, "YYYY-MM").startOf('month').format('YYYY-MM-DD');
    const endDate = moment(`${year}-${month}`, "YYYY-MM").endOf('month').format('YYYY-MM-DD');
    
    return { startDate, endDate };
};

export const getMonthNumber = (monthName) => {
  return moment(monthName, 'MMM').month() + 1; // Adding 1 because months are 0-indexed
};

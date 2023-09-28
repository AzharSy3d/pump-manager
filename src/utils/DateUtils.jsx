/*
Author: Azhar Syed 
DateUtils.jsx (c) 2023
*/

import moment from "moment";

const DATE_FORMAT = "MMMM Do YYYY, h:mm:ss a";

export function formatDateMMMDoYYYY(date) {
  return moment(date).format(DATE_FORMAT);
}

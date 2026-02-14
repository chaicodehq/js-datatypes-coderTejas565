/**
 * 🚂 Indian Railway PNR Status System
 *
 * IRCTC ka PNR status system bana! PNR data milega with train info,
 * passengers, aur current statuses. Tujhe ek complete status report
 * generate karna hai with formatted output aur analytics.
 *
 * pnrData object:
 *   {
 *     pnr: "1234567890",
 *     train: { number: "12301", name: "Rajdhani Express", from: "NDLS", to: "HWH" },
 *     classBooked: "3A",
 *     passengers: [
 *       { name: "Rahul Kumar", age: 28, gender: "M", booking: "B1", current: "B1" },
 *       { name: "Priya Sharma", age: 25, gender: "F", booking: "WL5", current: "B3" },
 *       { name: "Amit Singh", age: 60, gender: "M", booking: "WL12", current: "WL8" }
 *     ]
 *   }
 *
 * Status rules (based on current field):
 *   - Starts with "B" or "S" (berth/seat) => status = "CONFIRMED"
 *   - Starts with "WL" => status = "WAITING"
 *   - Equals "CAN" => status = "CANCELLED"
 *   - Starts with "RAC" => status = "RAC"
 *
 * For each passenger generate:
 *   - formattedName: name.padEnd(20) + "(" + age + "/" + gender + ")"
 *   - bookingStatus: booking field value
 *   - currentStatus: current field value
 *   - statusLabel: one of "CONFIRMED", "WAITING", "CANCELLED", "RAC"
 *   - isConfirmed: boolean (true only if statusLabel === "CONFIRMED")
 *
 * Summary (use array methods on processed passengers):
 *   - totalPassengers: count of passengers
 *   - confirmed: count of CONFIRMED
 *   - waiting: count of WAITING
 *   - cancelled: count of CANCELLED
 *   - rac: count of RAC
 *   - allConfirmed: boolean - every passenger confirmed? (use every)
 *   - anyWaiting: boolean - some passenger waiting? (use some)
 *
 * Other fields:
 *   - chartPrepared: true if every NON-CANCELLED passenger is confirmed
 *   - pnrFormatted: "123-456-7890" (3-3-4 dash pattern, use slice + join or concatenation)
 *   - trainInfo: template literal =>
 *     "Train: {number} - {name} | {from} → {to} | Class: {classBooked}"
 *
 * Hint: Use padEnd(), slice(), join(), map(), filter(), every(), some(),
 *   startsWith(), template literals, typeof, Array.isArray()
 *
 * Validation:
 *   - Agar pnrData object nahi hai ya null hai, return null
 *   - Agar pnr string nahi hai ya exactly 10 digits nahi hai, return null
 *   - Agar train object missing hai, return null
 *   - Agar passengers array nahi hai ya empty hai, return null
 *
 * @param {object} pnrData - PNR data object
 * @returns {{ pnrFormatted: string, trainInfo: string, passengers: Array<{ formattedName: string, bookingStatus: string, currentStatus: string, statusLabel: string, isConfirmed: boolean }>, summary: { totalPassengers: number, confirmed: number, waiting: number, cancelled: number, rac: number, allConfirmed: boolean, anyWaiting: boolean }, chartPrepared: boolean } | null}
 *
 * @example
 *   processRailwayPNR({
 *     pnr: "1234567890",
 *     train: { number: "12301", name: "Rajdhani Express", from: "NDLS", to: "HWH" },
 *     classBooked: "3A",
 *     passengers: [
 *       { name: "Rahul", age: 28, gender: "M", booking: "B1", current: "B1" }
 *     ]
 *   })
 *   // => { pnrFormatted: "123-456-7890",
 *   //      trainInfo: "Train: 12301 - Rajdhani Express | NDLS → HWH | Class: 3A",
 *   //      passengers: [...], summary: { ..., allConfirmed: true }, chartPrepared: true }
 */
export function processRailwayPNR(pnrData) {
  if (pnrData === null || typeof pnrData !== "object") {
    return null;
  }
  if (typeof pnrData.pnr !== "string") {
    return null;
  }
  if (pnrData.pnr.length !== 10) {
    return null;
  }
  if (!/^\d{10}$/.test(pnrData.pnr)) {
    return null;
  }
  if (typeof pnrData.train !== "object") {
    return null;
  }
  if (!Array.isArray(pnrData.passengers) || pnrData.passengers.length === 0) {
    return null;
  }

  const part1 = pnrData.pnr.slice(0, 3);
  const part2 = pnrData.pnr.slice(3, 6);
  const part3 = pnrData.pnr.slice(6);

  const pnrFormatted = part1 + "-" + part2 + "-" + part3;

  const trainNumber = pnrData.train.number;
  const trainName = pnrData.train.name;
  const from = pnrData.train.from;
  const to = pnrData.train.to;
  const classBooked = pnrData.classBooked;

  const trainInfo =
    "Train: " + trainNumber +
    " - " + trainName +
    " | " + from + " → " + to +
    " | Class: " + classBooked;

  const passengers = [];
  for (let i = 0; i < pnrData.passengers.length; i++) {
    const p = pnrData.passengers[i];
    let statusLabel = "";
    if (p.current === "CAN") {
      statusLabel = "CANCELLED";
    } 
    else if (p.current.startsWith("WL")) {
      statusLabel = "WAITING";
    } 
    else if (p.current.startsWith("RAC")) {
      statusLabel = "RAC";
    } 
    else {
      statusLabel = "CONFIRMED";
    }

    const formattedName =
      p.name.padEnd(20) + "(" + p.age + "/" + p.gender + ")";
    const passengerObj = {
      formattedName: formattedName,
      bookingStatus: p.booking,
      currentStatus: p.current,
      statusLabel: statusLabel,
      isConfirmed: statusLabel === "CONFIRMED"
    };
    passengers.push(passengerObj);
  }

  let confirmed = 0;
  let waiting = 0;
  let cancelled = 0;
  let rac = 0;

  for (let i = 0; i < passengers.length; i++) {
    if (passengers[i].statusLabel === "CONFIRMED") confirmed++;
    if (passengers[i].statusLabel === "WAITING") waiting++;
    if (passengers[i].statusLabel === "CANCELLED") cancelled++;
    if (passengers[i].statusLabel === "RAC") rac++;
  }

  let allConfirmed = true;
  let anyWaiting = false;

  for (let i = 0; i < passengers.length; i++) {
    if (!passengers[i].isConfirmed) {
      allConfirmed = false;
    }
    if (passengers[i].statusLabel === "WAITING") {
      anyWaiting = true;
    }
  }

  const summary = {
    totalPassengers: passengers.length,
    confirmed: confirmed,
    waiting: waiting,
    cancelled: cancelled,
    rac: rac,
    allConfirmed: allConfirmed,
    anyWaiting: anyWaiting
  };

  let chartPrepared = true;

  for (let i = 0; i < passengers.length; i++) {
    if (
      passengers[i].statusLabel !== "CANCELLED" &&
      passengers[i].isConfirmed === false
    ) {
      chartPrepared = false;
    }
  }
  return {
    pnrFormatted: pnrFormatted,
    trainInfo: trainInfo,
    passengers: passengers,
    summary: summary,
    chartPrepared: chartPrepared
  };
}
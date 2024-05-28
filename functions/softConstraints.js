

function prefersDayShifts(schedule, user) {
    let dayShifts = schedule.filter(shift => shift.startTime >= 8 && shift.endTime <= 18); // assuming day shift is between 8 AM and 6 PM
    return dayShifts.length / schedule.length * 0.2; // return a value between 0.01 and 0.2 based on the proportion of day shifts
}

function avoidsNightShifts(schedule, user) {
    let nightShifts = schedule.filter(shift => shift.startTime >= 22 || shift.endTime <= 6); // assuming night shift is between 10 PM and 6 AM
    return (1 - nightShifts.length / schedule.length) * 0.2; // return a value between 0.01 and 0.2 based on the proportion of non-night shifts
}

function example3(schedule, user) {
    // Return a number between 0.01 and 0.2
    return 0.1;
  }

const constraints = {
    avoidNights: avoidsNightShifts,
    preferDay: prefersDayShifts,
    constraint3: example3
};

function getUserPreferences(user) {
    const functionList = [];
    user.preferences.forEach(element => { 
        if (constraints[element]) {
            functionList.push(constraints[element]);
        }
    });
    return functionList;
}

function checkSoftConstraints(schedule, user) {
    let totalWeight = 1;
    const userPreferenceFunctions = getUserPreferences(user, constraints);
    console.log("userPreferenceFunctions: ", userPreferenceFunctions)
    
    for (const preferenceFunction of userPreferenceFunctions) {
        totalWeight += preferenceFunction(schedule, user);
        console.log("totalWeight: ", totalWeight);
    }


    // Check if the total weight is greater than or equal to the threshold.
    // The threshold is calculated as 1 plus 0.2 times the number of user preference functions.
    // Each preference function returns a value between 0.01 and 0.2, representing the degree to which the user's preference is satisfied by the schedule.
    // If the total weight is greater than or equal to the threshold, return true, indicating that the user's preferences are sufficiently satisfied by the schedule.
    // If the total weight is less than the threshold, return false, indicating that the user's preferences are not sufficiently satisfied by the schedule.
    if (totalWeight >= 1 + 0.2 * userPreferenceFunctions.length) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    checkSoftConstraints
};
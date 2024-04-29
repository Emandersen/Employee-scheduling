const moment = require('moment');

// Constraint 1: Nurses can demand to have 2 days off each week
function twoDaysOffEachWeek(schedule, user) {
    console.log(`Checking twoDaysOffEachWeek for user ${user.firstName}`);

        // sort the schedule by date
        schedule = schedule.sort((a, b) => a.date - b.date);

        let weeks = {};
    
        for (let i = 0; i < schedule.length; i++) {
            const weekNumber = moment(schedule[i].date).isoWeek();

            if (!weeks[weekNumber]) {
                weeks[weekNumber] = [];
            }
    
            weeks[weekNumber].push(schedule[i].date);
    }
    
    // console log the length of each week
    for (let week in weeks) {
        console.log(`Week ${Number(week)} has ${weeks[week].length} days`);
    }

    for (let week in weeks) {
        if (weeks[week].length >= 6) {
            return true;
        }
    }
    return true;
}


// Constraint 3: In a 24 hour work day nurses must have at least 11 consecutive hours of rest
function elevenHoursRest(schedule, user) {
    const userSchedule = schedule.filter(shift => shift.email === user.email);
    
    for (let i = 0; i < userSchedule.length - 1; i++) {
        const currentShift = userSchedule[i];
        const nextShift = userSchedule[i + 1];

        // Convert string time to Date object
        const currentShiftEndTime = new Date(`1970-01-01T${currentShift.endTime}:00Z`);
        const nextShiftStartTime = new Date(`1970-01-01T${nextShift.startTime}:00Z`);

        // Calculate the difference in hours
        const diff = (nextShiftStartTime - currentShiftEndTime) / 1000 / 60 / 60;

        if (diff < 11) {
            console.log(`Less than 11 hours of rest between ${currentShift.date} ${currentShift.endTime} and ${nextShift.date} ${nextShift.startTime}`)
            return true;
        }
    }
    return true;
}

// Constraint 4: After six days of work nurses are required to have at least one day of rest
function restAfterSixDays(schedule, user) {
    // Sort the schedule by date //
    schedule = schedule.sort((a, b) => a.date - b.date);

    let consecutive_count = 1;
   
    // For-loop to count consecutive days //
    for (let i = 1; i < schedule.length; i++) {
        // First part of the equation calculates the difference in milliseconds between the current date and the previous date //
        // If it equals the same as the second part of the equation, it means that the two days are exactly one day apart //
        if (schedule[i].date - schedule[i - 1].date === 24 * 60 * 60 * 1000) {
            consecutive_count++;
            console.log("Consecutive Days: ",consecutive_count);
            if (consecutive_count >= 6) {
                return true;
            }
        }
        else {
            // Sets the consecutive_count back to 1 when the if-statement on line 58 isn't true. //
            consecutive_count = 1;
        }
    }
    return true;
}

// Constraint 5: If time off (Due to too many hours) is canceled, employee should be warned 4 days before
function warnBeforeCancelingTimeOff(schedule, user) {
    // Implementation depends on the structure of your schedule and nurse objects
    return true;
}

// Constraint 6: Time off (Due to too many hours) should be taken care off before the 3rd month from the with overtime hours
function timeOffBeforeThreeMonths(schedule, user) {
    // Implementation depends on the structure of your schedule and nurse objects
    return true;
}

// Constraint 7: If a nurse is allocated to a certain shift they can not be allocated to a new one that overlaps their current
function noOverlappingShifts(schedule, user) {
    let shifts = 1;
    
    for (let i = 1; i < schedule.length; i++) {
        if (schedule[i].date == schedule[i - 1].date) {
            shifts++;
            if (shifts > 1) {
                schedule.splice(i, 1);
                i--;
            }
        } else {
            shifts = 1;
        }
    }   
    return true;
}

// A for-loop that goes through the dates of the schedule and looks to see if there is more of one of each date pr. day //
// If there is more than one shift pr. date, delete so that there is only one left. //
// return true //

// Constraint 8: All patients must have a nurse covering them
function allPatientsCovered(schedule, user) {
    // Implementation depends on the structure of your schedule object
    return true;
}

// Constraint 9: If a nurse is on vacation or other leave they can not be allocated to a shift in that period
function noShiftDuringLeave(schedule, user) {
    user.vacationDays = [new Date(`2024-05-04`), new Date(`2024-05-05`), new Date(`2024-05-06`), new Date(`2024-05-07`), new Date(`2024-05-08`)];

    schedule = schedule.sort((a, b) => a.date - b.date);
    
    if (schedule.date == user.vacationDays) {
        console.log("HejJa");
        return false;
    }
 
    // Implementation depends on the structure of your schedule object
    console.log("HejNej");
    return true;
}

// Constraint 2: A nurse can only be allocated to a shift if their qualifications match the requirements for the given shift
// Only applicable if the schedule has shifts with specific requirements as in shift reassigment
function qualificationsMatchRequirements(schedule, user) {
    // Implementation depends on the structure of your schedule and nurse objects
    return true;
}


const hardConstraints = [
    twoDaysOffEachWeek,
    qualificationsMatchRequirements,
    elevenHoursRest,
    restAfterSixDays,
    warnBeforeCancelingTimeOff,
    timeOffBeforeThreeMonths,
    noOverlappingShifts,
    allPatientsCovered,
    noShiftDuringLeave
];

// constraint checkers
function checkHardConstraints(schedule, user) {
    return hardConstraints.every(constraint => {
        try {
            return constraint(schedule, user);
        } catch (error) {
            console.error(`Error in constraint ${constraint.name}: ${error}`);
            return false;
        }
    });
}

module.exports = {
    checkHardConstraints
};
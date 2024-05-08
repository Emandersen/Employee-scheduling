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
        const date1Day = ('0' + userSchedule[i].date.getUTCDate()).slice(-2);
        const date1Month = ('0' + (userSchedule[i].date.getUTCMonth() + 1)).slice(-2);
        const date1Year = userSchedule[i].date.getUTCFullYear();
        const date2Day = ('0' + userSchedule[i + 1].date.getUTCDate()).slice(-2);
        const date2Month = ('0' + (userSchedule[i + 1].date.getUTCMonth() + 1)).slice(-2);
        const date2Year = userSchedule[i+ 1].date.getUTCFullYear();

        // Convert string time to Date object
        const currentShiftEndTime = new Date(`${date1Year}-${date1Month}-${date1Day}T${currentShift.endTime}:00Z`);
        const nextShiftStartTime = new Date(`${date2Year}-${date2Month}-${date2Day}T${nextShift.startTime}:00Z`);

        // Calculate the difference in hours
        const diff = Math.floor((nextShiftStartTime - currentShiftEndTime) / (1000 * 60 * 60));
        console.log(diff);
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
            console.log("Consecutive Days: ", consecutive_count);
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

function calculateOvertimeDueDate(overtimeMonths, user, schedule) {
    // Parse the start date
    const currentDate = new Date();
    const parsedStartDate = schedule.date

    // Calculate the difference in months between the current date and the start date
    const diffMonths = (currentDate.getFullYear() - parsedStartDate.getFullYear()) * 12 + currentDate.getMonth() - parsedStartDate.getMonth();

    // Calculate the due date based on the overtime months
    switch (overtimeMonths) {
        case 3:
            console.log(`${user.firstName} ${user.lastname} Overtime needs to be held this month`);
            break;
        case 2:
            if (diffMonths >= 2) {
                console.log(`${user.firstName} ${user.lastname} Overtime needs to be held this month`);
            } else {
                console.log(`${user.firstName} ${user.lastname} Overtime needs to be held at latest next month`);
            }
            break;
        case 1:
            if (diffMonths >= 1) {
                console.log(`${user.firstName} ${user.lastname} Overtime needs to be held this month`);
            } else if (diffMonths === 0) {
                console.log(`${user.firstName} ${user.lastname} Overtime needs to be held at latest next month`);
            } else {
                console.log(`${user.firstName} ${user.lastname} Overtime needs to be held at latest in 2 months`);
            }
            break;
        default:
            console.log("Invalid input");
    }
}

// Constraint 5: If time off (Due to too many hours) is canceled, employee should be warned 4 days before
function warnBeforeCancelingTimeOff(schedule, user) {

    for (let i = 1; i < schedule.length; i++) {
        if (schedule[i+4].date) {
            console.log(`${user.firstName} ${user.lastName} you time off have been canceled and you have a shift in 4 days`);
            alert(`${user.firstName} ${user.lastName} you time off have been canceled and you have a shift in 4 days`)
            // todo: find a way to notify x user properly
        }
        if (user.vacationDays[i+4]){
            console.log(`${user.firstName} ${user.lastName} is on vacation`);
            return false;
        }
    }



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
    for (let i = 1; i < schedule.length; i++) {
        if (schedule[i].date.getTime() === schedule[i - 1].date.getTime() &&
            schedule[i].startTime < schedule[i - 1].endTime) {
            // Remove the overlapping shift at index i
            schedule.splice(i, 1);
            i--; // Decrement i to recheck the current index after removal
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
    for(let i = 0; i < schedule.length; i++) {
        for(let j = 0; j < user.vacationDays.length; j++) {
            if (schedule[i].date.toISOString() === user.vacationDays[j].toISOString() &&
                schedule[i].email === user.email) {
                console.log(schedule[i].date + " = " + user.vacationDays[j]);
                return false;
            }
        }
    }
    //user.vacationDays[i] = `2024-05-${i}`;
    console.log(user.vacationDays);
 
    // Implementation depends on the structure of your schedule object
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
    checkHardConstraints,
    twoDaysOffEachWeek,
    qualificationsMatchRequirements,
    elevenHoursRest,
    restAfterSixDays,
    warnBeforeCancelingTimeOff,
    timeOffBeforeThreeMonths,
    noOverlappingShifts,
    allPatientsCovered,
    noShiftDuringLeave
};
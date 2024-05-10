const moment = require('moment');

// Soft constraints should always return a value between 0.01 and 0.2 , if the soft constraint critiria is not met
// then the function should return the value as a minus value.

// The more a nurse has worked the less prioritized they should be for emergency shifts
function lessPrioritizedOverworkedNurse(schedule, user) {
    let prioritized = 0;
    let i = 0;
    let check = 0;

    const userSchedule = schedule.filter(shift => shift.email === user.email);
    
    schedule = schedule.sort((a, b) => a.date - b.date);

    const dateForBeginningDay = new Date();
    const yearForBeginningDay = dateForBeginningDay.getUTCFullYear();
    const monthForBeginningDay = dateForBeginningDay.getUTCMonth() + 1; // months from 1-12
    const dayForBeginningDay = dateForBeginningDay.getUTCDate();

    let beginningDay = yearForBeginningDay + "/" + monthForBeginningDay + "/" + dayForBeginningDay;

    let endDay = new Date();

    endDay.setDate(beginningDay.getDate() + 7);

    for (i = 0; i < schedule.length; i++) {
        if (beginningDay === new Date(userSchedule[i].date)) {
            check = 1;
            break;
        } else if ((beginningDay + 1) === new Date(userSchedule[i].date)) {
            check = 2;
            break;
        } else if ((beginningDay + 2) === new Date(userSchedule[i].date)) {
            check = 3;
            break;
        } else if ((beginningDay + 3) === new Date(userSchedule[i].date)) {
            check = 4;
            break;
        } else if ((beginningDay + 4) === new Date(userSchedule[i].date)) {
            check = 5;
            break;
        } else if ((beginningDay + 5) === new Date(userSchedule[i].date)) {
            check = 6;
            break;
        } else if ((beginningDay + 6) === new Date(userSchedule[i].date)) {
            check = 7;
            break;
        } else if (endDay === new Date(userSchedule[i].date)) {
            check = 8;
            break;
        } 
    }

    if (check === 0)
    {
        prioritized = -0.2;
        return prioritized;
    }

    let shift = userSchedule[i];
    const dateDay = ('0' + shift.date.getUTCDate()).slice(-2);
    const dateMonth = ('0' + (shift.date.getUTCMonth() + 1)).slice(-2);
    const dateYear = shift.date.getUTCFullYear();

    const shiftStartTime = new Date(`${dateYear}-${dateMonth}-${dateDay}T${shift.startTime}:00Z`);
    const shiftEndTime = new Date(`${dateYear}-${dateMonth}-${dateDay}T${shift.endTime}:00Z`);

    let workhours = Math.floor((shiftStartTime - shiftEndTime) / (1000 * 60 * 60));

    for (let j = (check - 1); j < 8; j++) {
        let k = 1;
        let malleableShift = userSchedule[i + k];
        const malleableDay = ('0' + malleableShift.date.getUTCDate()).slice(-2);
        const malleableMonth = ('0' + (malleableShift.date.getUTCMonth() + 1)).slice(-2);
        const malleableYear = malleableShift.date.getUTCFullYear();

        const malleableShiftStartTime = new Date(`${malleableYear}-${malleableMonth}-${malleableDay}T${malleableShift.startTime}:00Z`);
        const malleableShiftEndTime = new Date(`${malleableYear}-${malleableMonth}-${malleableDay}T${malleableShift.endTime}:00Z`);

        let malleableWorkhours = Math.floor((malleableShiftStartTime - malleableShiftEndTime) / (1000 * 60 * 60));

        workhours = workhours + malleableWorkhours;
    }

    let diff = workhours / (7 * 24);

    prioritized = diff * 0.2;
    return prioritized;
}

function example2() {
  return true;
}

function example3() {
    return true;
}

const constraints = {
    lessPrioritizedOverworkedNurse,
    constraint2: example2,
    constraint3: example3
};

function user_preferences(user) {
    const functionList = [];
    user.preferences.forEach(element => { 
        if (constraints[element]) {
            functionList.push(constraints[element]);
        }
    });
    return functionList;
}


function softConstraints(user) {
    const weightgain = 1;
    const functionList = user_preferences(user, constraints);
    
    for (const funkypunky of functionList) {
        weightgain += funkypunky(user, schedule);
    }
    if (weightgain => 0.6) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    lessPrioritizedOverworkedNurse
};
// Weighting system for soft constraints

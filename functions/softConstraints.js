const moment = require('moment');

// Soft constraints should always return a value between 0.01 and 0.2 , if the soft constraint critiria is not met
// then the function should return the value as a minus value.

// The more a nurse has worked the less prioritized they should be for emergency shifts
function lessPrioritizedOverworkedNurse(schedule, user) {
    let prioritized = 0;
    let weeks = {};

    const userSchedule = schedule.filter(shift => shift.email === user.email);
    
    schedule = schedule.sort((a, b) => a.date - b.date);

    for (let i = 0; i < schedule.length; i++) {
        let beginningDay = new Date(userSchedule[i].date);
        let endDay = new Date();

        endDay.setDate(beginningDay.getDate() + 7);

        for (let j = beginningDay; j < endDay; j++) {
            
        }
    }


    prioritized = -0.2;
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


// Weighting system for soft constraints

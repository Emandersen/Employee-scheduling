function example1() {
  // Return a number between 0.01 and 0.2
  return 0.1;
}

function example2() {
  // Return a number between 0.01 and 0.2
  return 0.15;
}

function example3() {
  // Return a number between 0.01 and 0.2
  return 0.2;
}

const constraints = {
    constraint1: example1,
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

function softConstraints(user, schedule) {
    let weightgain = 1;
    const functionList = user_preferences(user, constraints);
    
    for (const funkypunky of functionList) {
        weightgain += funkypunky(user, schedule);
    }
    if (weightgain >= 0.6) {
        return weightgain;
    } else {
        return -weightgain;
    }
}
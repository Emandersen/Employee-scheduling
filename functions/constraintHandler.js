// Constraint definitions:
function HourlyConstraint(vars) {
    // Use vars in some way
    return true;
}

const hardConstraints = [
    HourlyConstraint,
];

// bind each constraint to a key
const constraints = {
    "HourlyConstraint": HourlyConstraint,
};

// constraint checkers
function checkHardConstraints(vars = {}) {
    return hardConstraints.every(constraint => {
        try {
            return constraint(vars);
        } catch (error) {
            console.error(`Error in constraint ${constraint.name}: ${error}`);
            return false;
        }
    });
}

// Modify the checkSoftConstraints function to take a list of keys
function checkSoftConstraints(constraintKeys, vars = {}) {
    return constraintKeys.every(key => {
        if (key in constraints) {
            try {
                return constraints[key](vars);
            } catch (error) {
                console.error(`Error in constraint ${key}: ${error}`);
                return false;
            }
        } else {
            throw new Error(`Constraint ${key} not found`);
        }
    });
}

module.exports = {
    checkHardConstraints,
    checkSoftConstraints,
};
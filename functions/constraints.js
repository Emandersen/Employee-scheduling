

function checkHardConstraints() {
    return constraints.every(constraint => {
        return constraint();
    });
}

function checkSoftConstraints(constraints) {
    return constraints.every(constraint => {
        return constraint();
    });
}

// Constraint definitions:
function HourlyConstraint() {
    return true;
}


module.exports = {
    checkHardConstraints,
    checkSoftConstraints,
};


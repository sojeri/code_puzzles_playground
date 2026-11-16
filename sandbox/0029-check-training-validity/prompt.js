/**
// Example 1: Checking within the training window
// training_window: 10 days
// employee: {start_day: 100}
// check_day: 104
// result: {name: "pending", days_overdue: 0}

//              |<-----------------------training window------------------->|
// Time:  |-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
// Days: 99    100   101   102   103   104   105   106   107   108   109   110   111
//              |                       |
//          start_day                check_day

// Example 2: Checking after the employee completed training
// training_window: 10 days
// employee: {start_day: 100, trained_day: 105}
// check_day: 110
// result: {name: "completed", days_overdue: 0}

//              |<-----------------------training window------------------->|
// Time:  |-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
// Days: 99    100   101   102   103   104   105   106   107   108   109   110   111
//              |                             |                             |
//          start_day                    trained_day                    check_day

// Example 3: Checking after training, even though training was outside of window
// training_window: 5 days
// employee: {start_day: 100, trained_day: 107}
// check_day: 110
// result: {name: "completed", days_overdue: 0}

//              |<------training window------>|
// Time:  |-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
// Days: 99    100   101   102   103   104   105   106   107   108   109   110   111
//              |                                         |                 |
//          start_day                                trained_day         check_day

// Example 4: Reviewing the status in the past
// training_window: 5 days
// employee: {start_day: 100, trained_day: 109}
// check_day: 106
// result: {name: "overdue", days_overdue: 1}

//              |<------training window------>|
// Time:  |-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
// Days: 99    100   101   102   103   104   105   106   107   108   109   110   111
//              |                                   |                 |
//          start_day                           check_day         trained_day

// Example 5: Reviewing the status before starting day
// training_window: 10 days
// employee: {start_day: 100}
// check_day: 99
// result: {name: "not_required", days_overdue: 0}

//              |<-----------------------training window------------------->|
// Time:  |-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
// Days: 99    100   101   102   103   104   105   106   107   108   109   110   111
//        |      |                                                    
//    check_day start_day                                   
// Test cases!



// (employee, training_window, check_day)           -> (status)


// {"start_day": 100                    }, 10, 104  -> {"name": "pending",      "days_overdue": 0}
// {"start_day": 100, "trained_day": 105}, 10, 110  -> {"name": "completed",    "days_overdue": 0}
// {"start_day": 100, "trained_day": 107},  5, 110  -> {"name": "completed",    "days_overdue": 0}
// {"start_day": 100, "trained_day": 109},  5, 106  -> {"name": "overdue",      "days_overdue": 1}
// {"start_day": 100                    }, 10,  99  -> {"name": "not_required", "days_overdue": 0}
 */

/*
Type Employee:
{
  startDay: number; // The day the employee started working at the company (in days)
  trainedDay?: number; // The day the employee was trained (in days), optional
}

Type Status:
{
  name: string; // one of ["not_required", "pending", "overdue", "completed"]
  daysOverdue: number; // 0 if not overdue
}
*/

const PENDING = { name: 'pending', overdue: 0 }
const NOT_REQUIRED = { name: 'not_required', overdue: 0 }
const COMPLETED = { name: 'completed', overdue: 0 }
const OVERDUE = { name: 'overdue', overdue: 0 }

/**
 * getTrainingStatus is a function that evaluates an employee's training status on a specified check_day.
 *
 * @param {Employee} employee
 * @param {number} trainingWindow - The number of days an employee has to complete their training after their start day.
 * @param {number} checkDay - The day for which we are checking the employee's training status.
 *
 * @returns {Status} - The employee's training status on the check_day.
 */
function getTrainingStatus(employee, trainingWindow, checkDay) {
    const trainedDay =
        employee?.trainedDay === undefined
            ? Number.POSITIVE_INFINITY
            : employee?.trainedDay
    const { startDay } = employee

    if (checkDay >= trainedDay) return COMPLETED
    if (startDay > checkDay) return NOT_REQUIRED
    if (trainedDay > checkDay) {
        const trainingEnd = startDay + trainingWindow

        // 110 - 106 => + pending; 110 - 116 => - overdue
        const overdue = trainingEnd - checkDay

        return overdue >= 0 ? PENDING : { ...OVERDUE, overdue: Math.abs(overdue) }
    }

    return {
        name: 'not_implemented',
        daysOverdue: -1,
    }
}
/*
  use this fn to calculate metrics for all employees
   - emp will have a groupID matching their org group
*/

/*
Test cases to paste to speed up candidate when they get to testing:

(employee, trainingWindow, checkDay)            -> (status)

{"startDay": 100                   }, 10, 104  -> {"name": "pending",      "daysOverdue": 0}
{"startDay": 100, "trainedDay": 105}, 10, 110  -> {"name": "completed",    "daysOverdue": 0}
{"startDay": 100, "trainedDay": 107},  5, 110  -> {"name": "completed",    "daysOverdue": 0}
{"startDay": 100, "trainedDay": 109},  5, 106  -> {"name": "overdue",      "daysOverdue": 1} 
{"startDay": 100                   }, 10,  99  -> {"name": "not_required", "daysOverdue": 0}

*/

// console.log(getTrainingStatus({startDay: 100}, 10, 104)); // {"name": "pending",      "daysOverdue": 0}
// console.log(getTrainingStatus({startDay: 100, trainedDay: 105}, 10, 110)); // {"name": "completed",    "daysOverdue": 0}
// console.log(getTrainingStatus({startDay: 100, trainedDay: 107}, 5, 110)); // {"name": "completed",    "daysOverdue": 0}
// console.log(getTrainingStatus({startDay: 100, trainedDay: 109}, 5, 106)); // {"name": "overdue",      "daysOverdue": 1}
// console.log(getTrainingStatus({startDay: 100}, 5, 99)); // {"name": "not_required", "daysOverdue": 0}

// console.log(getTrainingStatus({startDay: 100, trainedDay: 110}, 10, 110)); // {"name": "completed",      "daysOverdue": 0}

// // Employee trained on day 0, window is days 1 - 11, check on day 5
// console.log(getTrainingStatus({startDay: 1, trainedDay: 0}, 10, 5));

/*
Employee:
{
  startDay: number; // The day the employee started working at the company (in days)
  trainedDay?: number; // The day the employee was trained (in days), optional
  groupId: string, // Indicates the group to which the employee belongs
}

Group:
{
  id: string, // Unique identifier for the group
  parentId: string (optional), // ID of the parent group, if any
  childIds: Array<string>, // IDs of the child groups
}

Datapoint:
{
  groupId: string,
  numEmployees: number,
  totalDaysOverdue: number,
}
*/

/**
 * This function returns the total days overdue for training completion + number of employees for each
 * group, considering both direct and indirect (i.e., through sub-groups)
 * employee memberships.
 *
 * @param {Array<Employee>} employees
 * @param {Object<string, Group>} groupsById - A dictionary mapping a group id to the corresponding Group.
 * @param {number} trainingWindow - Duration (number of days) employees have to complete their training.
 * @param {number} checkDay - The day for which we are checking the training statuses.
 *
 * @return {Array<Datapoint>} - A list of Datapoints, one for each Group.
 */
function getTotalDaysOverdueByGroups(employees, groupsById, trainingWindow, checkDay) {
    /** direct group training info, no aggregate data from child => parent */
    const baseTrainingData = {}
    employees.forEach(emp => {
        const { daysOverdue } = getTrainingStatus(emp, trainingWindow, checkDay)
        const { groupId } = emp
        if (baseTrainingData[groupId]) {
            baseTrainingData[groupId].totalDaysOverdue += daysOverdue
            baseTrainingData[groupId].numEmployees += 1
        } else {
            baseTrainingData[groupId] = {
                totalDaysOverdue: daysOverdue,
                numEmployees: 1,
            }
        }
    })

    /** full training counts with aggregation from child => parent */
    const finalTotals = {}
    const groupIds = Object.keys(groupsById)
    groupIds.forEach(gid => {
        const group = groupsById[gid]
        const groupData = getOrCalculateChildGroupData(
            baseTrainingData,
            finalTotals,
            group
        )
        finalTotals[gid] = groupData
    })

    // TODO: Implement
    /*
    {
      groupId: string,
      numEmployees: number,
      totalDaysOverdue: number,
    }
  */
    return []
}

function getOrCalculateChildGroupData(baseData, finalData, group) {
    const getData = id => {
        if (finalData[id]) return finalData[id]
        return baseData[id]
    }
    // TODO: handle groupIds with no employees
    const { id, childIds } = group
    const groupdData = getData(id)

    const children = { totalDaysOverdue: 0, numEmployees: 0 }
    childIds.forEach(cid => {
        const childGroup = baseData[cid]
        const child = getOrCalculateChildGroupData(baseData, finalData, childGroup)
        children.totalDaysOverdue += child.totalDaysOverdue
        children.numEmployees += child.numEmployees
    })

    groupdData.totalDaysOverdue += children.totalDaysOverdue
    groupdData.numEmployees += children.totalDaysOverdue

    return groupdData
}

// Example:
const trainingWindow = 10
const checkDay = 120

// Note: In this example, no one did training!
const employees = [
    { startDay: 100, groupId: 'a' }, // daysOverdue: 10
    { startDay: 105, groupId: 'b' }, // daysOverdue: 5
    { startDay: 110, groupId: 'b' }, // daysOverdue: 0
    { startDay: 105, groupId: 'c' }, // daysOverdue: 5
]

const groupsById = {
    a: { id: 'a', childIds: ['b'] },
    b: { id: 'b', parentId: 'a', childIds: ['c'] },
    c: { id: 'c', parentId: 'b', childIds: [] },
}

const result = getTotalDaysOverdueByGroups(
    employees,
    groupsById,
    trainingWindow,
    checkDay
)
console.log(result)

/*
Expected Output:
[
  { groupId: "a", numEmployees: 4, totalDaysOverdue: 20 },
  { groupId: "b", numEmployees: 3, totalDaysOverdue: 10 },
  { groupId: "c", numEmployees: 1, totalDaysOverdue: 5 }
]
*/

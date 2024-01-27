const cron = require("node-cron");
const twilio = require("twilio");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");

// Twilio credentials
const accountSid = "your_account_sid";
const authToken = "your_auth_token";
const twilioClient = twilio(accountSid, authToken);

//Cron scheduling function for twillio call
const scheduleCall = () => {
  cron.schedule(
    "0 0 * * *",
    async function () {
      twillioVoiceCalling();
    },
    { scheduled: true, timezone: "Asia/Kolkata" }
  );
};

//Function to call when dueDate matches today date based on priority
const twillioVoiceCalling = async () => {
  //Getting all the users by prioroty
  const users = await getUsersByPriority();

  //Iterate over to the users and find associated tasks
  users.forEach(async (user) => {
    //Find all the task that associated to this user
    const tasks = await taskModel.find({ user: user._id });
    callingOnDueDateMatch(tasks);
  });
};

const callingOnDueDateMatch = (tasks) => {
  const today = new Date();
  //Storing called users id
  const alreadyCalled = [];
  //Iterate to the tasks list and make call if dueDate matches
  tasks.forEach((task) => {
    if (task.dueDate.toDateString() === today.toDateString()) {
      //Logic if the user is being already called
      if (!alreadyCalled.includes(task.user)) {
        callUser(task.user);
        alreadyCalled.push(task.user);
      }
    }
  });
};
//Function containing twillio calling logic;
const callUser = async (userId) => {
  try {
    //Find user details from userId
    const user = await userModel.findById(userId);
    const fromPhoneNumber = "your_twilio_phone_number";
    const toPhoneNumber = user.phoneNumber;

    await twilioClient.calls.create({
      url: "http://your-server.com/twiml", // Replace with your TwiML URL
      to: toPhoneNumber,
      from: fromPhoneNumber,
      method: "GET",
    });
  } catch (error) {
    console.error(`Error making voice call: ${error.message}`);
  }
};

const getUsersByPriority = async () => {
  try {
    const users = await userModel.find().sort({ priority: -1 });
    return users;
  } catch (error) {
    console.log(`Error in fetching sorted users ${error}`);
  }
};


//Changing priority of task based on dueDate, this function takes
// 3 arguments, a task object, priorityType(whether you want to increase or decrease the dueDate of task)
//and the dueDate value needs to be decreased on increased;
const changePriority = (task, priorityType, priorityVal) => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      const today = new Date();
      if (priorityType === "INCREASE") {
        task.dueDate = today + priorityVal;
      }
      if (priorityType === "DECREASE") {
        task.dueDate = today - priorityVal;
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata", // Set your timezone here
    }
  );
};


module.exports = { changePriority, scheduleCall };

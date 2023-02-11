require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

//--Setting up OpenAI--//
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const model = 'text-davinci-002';

const convertDurationToMinutes = (duration) => {
    const durationRegex = /(\d+)\s*(hour|day|week)/;
    const matches = durationRegex.exec(duration);
    let minutes = 0;
  
    if (matches) {
      const amount = parseInt(matches[1]);
      const unit = matches[2];
      if (unit === 'hour') {
        minutes = amount * 60;
      } else if (unit === 'day') {
        minutes = amount * 1440;
      } else if (unit === 'week') {
        minutes = amount * 10080;
      }
    }
  
    return minutes;
};

const generateTaskList = async (req, res) => {
    const goal = req.body.goal;
    const timeline = req.body.timeline;
  
    const taskPrompt = `generate a task list for the goal "${goal}" with a timeline of "${timeline}"`;
    const durationPrompt = `provide a feasible duration for each task in the task list generated for the goal "${goal}" with a timeline of "${timeline}"`;
    const proofPrompt = `what evidence should be provided to a second party for each task in the task list generated for the goal "${goal}" with a timeline of "${timeline}"`;

    try {
      const taskResponse = await openai.createCompletion({
        model,
        prompt: taskPrompt,
        max_tokens: 1000,
        n: 1,
        stop: null,
        temperature: 0.5
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });
  
      const durationResponse = await openai.createCompletion({
        model,
        prompt: durationPrompt,
        max_tokens: 1000,
        n: 1,
        stop: null,
        temperature: 0.5
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });
  
      const proofResponse = await openai.createCompletion({
        model,
        prompt: proofPrompt,
        max_tokens: 1000,
        n: 1,
        stop: null,
        temperature: 0.5
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });
  
      const taskList = taskResponse.data.choices[0].text;
      const durations = durationResponse.data.choices[0].text;
      const proofs = proofResponse.data.choices[0].text;
  
      const tasks = taskList.split("\n");
      const updatedTasks = tasks.map(task => task.replace('- [ ]', ''));
      const taskDurations = durations.split("\n");
      const taskProofs = proofs.split("\n");
  
      const finalTasks = [];
      for (let i = 0; i < tasks.length; i++) {
        const durationInMinutes = convertDurationToMinutes(taskDurations[i]);
        finalTasks.push({
          id: i + 1,
          task: updatedTasks[i],
          duration: {
            title: taskDurations[i],
            value: durationInMinutes
          },
          proof: taskProofs[i]
        });
      }
  
      res.send({ tasks: finalTasks.slice(2) });
    } catch (error) {
      if (error.response) {
        console.log("Error status", error.response.status);
        console.log("error data ", error.response.data);
      } else {
        console.log(error.message);
      }
    }
};

module.exports = { generateTaskList }
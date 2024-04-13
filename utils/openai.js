const { OpenAI } = require('openai');
const fs = require('node:fs');

const openai = new OpenAI();

const modelText = fs.readFileSync('./models/tour.model.js', { encoding: 'utf8' });

const prompt =
   'You need to generate random travel tour data by the following mongoose schema: \n' +
   '```\n' +
   modelText +
   '```\n' +
   'Provide answer with the exact fields from the schema: \n' +
   '- name;\n' +
   '- summary;\n' +
   '- description;\n' +
   '- price;\n' +
   '- priceDiscount;\n' +
   '- duration;\n' +
   '- maxGroupSize;\n' +
   '- difficulty;\n' +
   '- startLocation;\n' +
   '- locations;\n' +
   '\n' +
   "User will provide the place where a tour will take place. If user input is 'random' choose random place in the world.";

module.exports = async function (userInput) {
   const chatCompletion = await openai.chat.completions.create({
      response_format: { type: 'json_object' },
      messages: [
         { role: 'system', content: prompt },
         { role: 'user', content: userInput },
      ],
      model: 'gpt-3.5-turbo-0125',
   });
   return JSON.parse(chatCompletion.choices[0].message.content);
};

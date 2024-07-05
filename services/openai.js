const { OpenAI } = require('openai');
const fs = require('node:fs');
const path = require('node:path');

const openai = new OpenAI();

const modelText = fs.readFileSync(path.resolve(process.cwd(), 'components', 'tours', 'tours.model.js'), {
   encoding: 'utf8',
});

const prompt =
   'You need to generate random travel tour data by the following mongoose schema: use different name every time\n' +
   '```\n' +
   modelText +
   '```\n' +
   'Provide answer with the exact fields from the schema: \n' +
   '- name;\n' +
   '- summary;\n' +
   '- description;\n' +
   '- price;\n' +
   '- priceDiscount;\n' +
   '- duration (must not be more than 5);\n' +
   '- maxGroupSize;\n' +
   '- difficulty;\n';

module.exports = async function () {
   const chatCompletion = await openai.chat.completions.create({
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-3.5-turbo-0125',
   });
   return JSON.parse(chatCompletion.choices[0].message.content);
};

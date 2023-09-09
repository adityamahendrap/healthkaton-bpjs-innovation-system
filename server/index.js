import service from './service.js';
import 'dotenv/config'
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: "user", content: "Say this is a test" }],
//     model: "gpt-3.5-turbo",
// });

// const response = await openai.chat.completions.create({
//   model: "gpt-3.5-turbo",
//   messages: [{"role": "system", "content": "You are a helpful assistant."},
//       {"role": "user", "content": "Who won the world series in 2020?"},
//       {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
//       {"role": "user", "content": "Where was it played?"}],
// });

// console.log(response.choices);

const test = async() => {
  const pos = [115.21837733193006, -8.687038481433506]
  // const res = await service.getNearestHospital(115.21837733193006, -8.687038481433506);
  // const res = await service.compareRegion(
  //   { long: 115.21837733193006, lat: -8.687038481433506 }, 
  //   { long: 95.29498460845947, lat: 5.530134093895262 }
  // )
  // const res = await service.getBedAvailabilityInNearestHospital(...pos);

  const res = await service.getUserPositionInformation(...pos);
  console.log(res);
}

test()

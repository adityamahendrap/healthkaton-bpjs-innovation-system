import service from "./service.js";
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import axios from "axios";
import {
  openAiRequestCount,
  icrementOpenAiRequestCount,
  resetOpenAiRequestCount,
} from "./lib/helper.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask-gpt", async (req, res) => {
  const { question } = req.body;
  const response = await service.askGPT(question);
  res.json(response);
});

app.post("/driven-qna", async (req, res) => {
  let { question } = req.body;
  const long = Number(req.body.long);
  const lat = Number(req.body.lat);
  let template;
  const suffix =
    'SUFFIX: pada akhir jawaban sampaikan salam hangat dari "JKNSMARTSUPPORT"';

//   // Check if the user is asking about the nearest hospital
//   template = `Apakah pertanyaan ini mengenai rumah sakit terdekat secara eksplisit?
// Jika iya, silahkan balas dengan "1". Jika tidak, balas dengan "0".
// PERTANYAAN: ${question}`;
//   const nearestHospitalQuestion = await service.askGPT(template);

//   if (Number(nearestHospitalQuestion)) {
//     const hospitals = await service.getNearestHospital(long, lat);
//     console.log(hospitals);

//     // Format the hospital data as an array of objects
//     // Format the hospital data as an array of formatted strings
//     const formattedHospitals = hospitals.map((hospital, index) => {
//       return `Rumah Sakit ${hospital.name}
//               Alamat: ${hospital.address}
//               Provinsi: ${hospital.Province.name}
//               Kota: ${hospital.City.name}
//               Jarak: ${hospital.distance_km} km
//               Lokasi:${hospital.gmaps_url}\n`;
//     });

//     // Join the formatted hospital strings with newlines
//     const formattedData = formattedHospitals.join("\n");

//     // Update the template with the formatted data
//     template = `Ini adalah data rumah sakit terdekat, sampaikan kepada user:
// DATA:\n${formattedData}
// JAWABAN: \n${suffix}`;

//     const answer = await service.askGPT(template);
//     res.json(answer);
//     resetOpenAiRequestCount();
//     return;
//   }

//   // check if user asking for bed availability, answer with bed availability in nearest hospital
//   template = `Apakah pertanyaan ini mengenai ketersediaan tempat tidur/kamar secara eksplisit?
// Jika iya, silahkan balas dengan "1". Jika tidak, balas dengan "0".
// PERTANYAAN: ${question}`;
//   const bedAvailabilityQuestion = await service.askGPT(template);
//   if (Number(bedAvailabilityQuestion)) {
//     const beds = await service.getBedAvailabilityInNearestHospital(long, lat);
//     console.log(beds);
//     template = `Ini adalah data ketersediaan tempat tidur di rumah sakit terdekat, sampaikan kepada user:
// DATA: ${JSON.stringify(beds)}
//   ${suffix}`;
//     const answer = await service.askGPT(template);
//     res.json(answer);
//     resetOpenAiRequestCount();
//     return;
//   }

//   // check if user asking for user position information
//   template = `Apakah pertanyaan ini menanyakan lokasi user secara eksplisit?
// Jika iya, silahkan balas dengan "1". Jika tidak, balas dengan "0".
// PERTANYAAN: ${question}`;
//   const userPositionInformationQuestion = await service.askGPT(template);
//   if (Number(userPositionInformationQuestion)) {
//     const userPositionInformation = await service.getUserPositionInformation(
//       long,
//       lat
//     );
//     console.log(userPositionInformation);
//     template = `Ini adalah data lokasi user, sampaikan kepada user:
// DATA: ${JSON.stringify(userPositionInformation)}
//   ${suffix}`;
//     const answer = await service.askGPT(template);
//     res.json(answer);
//     resetOpenAiRequestCount();
//     return;
//   }

//   // check if user asking for bpjs information
//   // then handle with langchain in python
//   template = `Apakah pertanyaan ini menanyakan informasi seputar BPJS secara eksplisit?
// Jika iya, silahkan balas dengan "1". Jika tidak, balas dengan "0".
// PERTANYAAN: ${question}`;
//   const bpjsRelevance = await service.askGPT(template);
//   console.log(bpjsRelevance);
//   question = question.toLowerCase();
//   const matchString = question.includes("bpjs") || question.includes("jkn");
//   if (Number(bpjsRelevance) || matchString) {
//     console.log("processing request with langchain...");
//     const answer = await axios.post("http://localhost:5000/langchain", {
//       question,
//       openAiRequestCount,
//     });
//     icrementOpenAiRequestCount();
//     console.log("langchain:", answer.data);
//     res.json(answer.data);
//     resetOpenAiRequestCount();
//     return;
//   }

  template = `Anda berperan sebagai JKNSMARTSUPPORT.
JKNSMARTSUPPORT adalah chatbot AI yang hanya memberikan informasi mengenai program JKN dan BPJS.
Anda tidak perlu menjawab pertanyaan yang tidak sesuai peran anda!
PERTANYAAN: ${question}`;
  // default, ask GPT
  const answer = await service.askGPT(template);
  res.json(answer);
  resetOpenAiRequestCount();
  return;
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

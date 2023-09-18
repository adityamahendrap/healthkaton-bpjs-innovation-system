import service from "./service.js";
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import fs from "fs";

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
  const suffix = 'SUFFIX: pada akhir jawaban sampaikan salam hangat dari "JKNSMARTSUPPORT"'

  // Check if the user is asking about the nearest hospital
  template = `PERTANYAAN: ${question}
Apakah pertanyaan ini mengenai rumah sakit terdekat secara eksplisit?
Jika iya, silahkan balas dengan "1". Jika tidak, balas dengan "0".`;
  const nearestHospitalQuestion = await service.askGPT(template);

  if (Number(nearestHospitalQuestion)) {
    const hospitals = await service.getNearestHospital(long, lat);
    console.log(hospitals);

    // Format the hospital data as an array of objects
    // Format the hospital data as an array of formatted strings
    const formattedHospitals = hospitals.map((hospital, index) => {
      return `Rumah Sakit ${hospital.name}
        Alamat: ${hospital.address}
        Provinsi: ${hospital.Province.name}
        Kota: ${hospital.City.name}
        Jarak: ${hospital.distance_km} km
        Lokasi:${hospital.gmaps_url}\n`;
    });

    // Join the formatted hospital strings with newlines
    const formattedData = formattedHospitals.join("\n");

    // Update the template with the formatted data
    template = `Ini adalah data rumah sakit terdekat, sampaikan kepada user:\nDATA:\n${formattedData}\nJAWABAN: \n${suffix}`;

    const answer = await service.askGPT(template);
    res.json(answer);
    return;
  }

  // check if user asking for bed availability, answer with bed availability in nearest hospital
  template = `Apakah pertanyaan ini mengenai ketersediaan tempat tidur/kamar secara eksplisit?
Jika iya, silahkan balas dengan "1". Jika tidak, balas dengan "0".
PERTANYAAN: ${question}`;
  const bedAvailabilityQuestion = await service.askGPT(template);
  if (Number(bedAvailabilityQuestion)) {
    const beds = await service.getBedAvailabilityInNearestHospital(long, lat);
    console.log(beds);
    template = `Ini adalah data ketersediaan tempat tidur di rumah sakit terdekat, sampaikan kepada user:
DATA: ${JSON.stringify(beds)}
JAWABAN: 
${suffix}`;
    const answer = await service.askGPT(template);
    res.json(answer);
    return;
  }

  // check if user asking for user position information
  template = `Apakah pertanyaan ini menanyakan  lokasi user secara eksplisit?
Jika iya, silahkan balas dengan "1". Jika tidak, balas dengan "0".
PERTANYAAN: ${question}`;
  const userPositionInformationQuestion = await service.askGPT(template);
  if (Number(userPositionInformationQuestion)) {
    const userPositionInformation = await service.getUserPositionInformation(
      long,
      lat
    );
    console.log(userPositionInformation);
    template = `Ini adalah data lokasi user, sampaikan kepada user:
DATA: ${JSON.stringify(userPositionInformation)}
JAWABAN: 
${suffix}`;
    const answer = await service.askGPT(template);
    res.json(answer);
    return;
  }

  // check if user question relevant from data in database
  // then handle with langchain in python
  const dbSchema = fs.readFileSync("./prisma/schema.prisma", "utf8");
  template = `Apakah pertanyaan ini relevan dengan data yang ada di database?
DATABASE: ${dbSchema}
PERTANYAAN: ${question}
JAWABAN: `;
  const relevantQuestion = await service.askGPT(template);
  if (Number(relevantQuestion)) {
    const answer = await axios.post("http://localhost:5000/langchain", {
      question,
    });
    res.json(answer);
    return;
  }

  // default, ask GPT
  const answer = await service.askGPT(question);
  res.json(answer);
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

import prisma from '../prisma/prisma.js';
import beds from '../static/beds.json' assert { type: "json" };

function isoDatetime(inputString) {
  const parts = inputString.trim().split(' ');
  const datePart = parts[0];
  const timePart = parts[1];

  const [day, month, year] = datePart.split('-');
  const [hour, minute, second] = timePart.split(':');

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
}

async function generateData() {
  let hospitalId
  let bedClassId
  let temp
  let data = []

  for (let i = 0; i < beds.length; i++) {
    temp = await prisma.hospital.findFirst({ where: { name: beds[i].hospital.name }})
    hospitalId = temp.id

    for (let j = 0; j < beds[i].hospital.bedDetail.length; j++) {
      temp = await prisma.bedClass.findFirst({ where: { name: beds[i].hospital.bedDetail[j].stats.title }})
      bedClassId = temp.id
      data.push({
        hospital_id: hospitalId,
        bedclass_id: bedClassId,
        total: beds[i].hospital.bedDetail[j].stats.bed_available,
        empty: beds[i].hospital.bedDetail[j].stats.bed_empty,
        queue: beds[i].hospital.bedDetail[j].stats.queue,
        last_update: isoDatetime(beds[i].hospital.bedDetail[j].time)
      })     
    }
  }

  return data
}

(async () => {
  const data = await generateData();
  const result = await prisma.bed.createMany({ data });
  console.log(result);
})()
  .then(async () => {
    console.log("[SEED] Seeding table beds success");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
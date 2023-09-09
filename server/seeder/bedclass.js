import prisma from '../prisma/prisma.js';
import beds from '../static/beds.json' assert { type: "json" };

async function generateData() {
  let data = []

  for (let i = 0; i < beds.length; i++) {
    for (let j = 0; j < beds[i].hospital.bedDetail.length; j++) {
      data.push({
        name: beds[i].hospital.bedDetail[j].stats.title,
      })
    }
  }

  const uniqueNames = new Set(data.map(item => item.name));
  const uniqueData = [...uniqueNames].map(name => ({ name }));

  return uniqueData
}

(async () => {
  const data = await generateData();
  const result = await prisma.bedClass.createMany({ data });
  console.log(result);
})()
  .then(async () => {
    console.log("[SEED] Seeding table bedclass success");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
import prisma from '../prisma/prisma.js';
import cities from '../static/cities.json' assert { type: "json" };

async function generateData() {
  let provinceId
  let temp
  let data = []

  for (let i = 0; i < cities.length; i++) {
    temp = await prisma.province.findFirst({ where: { name: cities[i].province }})
    provinceId = temp.id

    for (let j = 0; j < cities[i].cities.cities.length; j++) {
      data.push({
        name: cities[i].cities.cities[j].name,
        province_id: provinceId
      })     
    }
  }

  return data
}

(async () => {
  const data = await generateData();
  const result = await prisma.city.createMany({ data });
  console.log(result);
})()
  .then(async () => {
    console.log("[SEED] Seeding table cities success");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
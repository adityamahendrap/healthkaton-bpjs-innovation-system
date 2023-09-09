import prisma from '../prisma/prisma.js';
import provinces from '../static/provinces.json' assert { type: "json" };

function generateData() {
  return provinces.map(p => ({ name: p.name }))
} 

(async () => {
  const data = generateData();
  const result = await prisma.province.createMany({ data });
  console.log(result);
})()
  .then(async () => {
    console.log("[SEED] Seeding table provinces success");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
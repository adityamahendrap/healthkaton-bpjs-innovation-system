import prisma from '../prisma/prisma.js';
import hospitals from '../static/hospitals.json' assert { type: "json" };
import maps from '../static/maps.json' assert { type: "json" };

async function generateData() {
  let provinceId
  let cityId
  let temp
  let data = []
  let map

  for (let i = 0; i < hospitals.length; i++) {
    temp = await prisma.province.findFirst({ where: { name: hospitals[i].province }})
    provinceId = temp.id
    temp = await prisma.city.findFirst({ where: { name: hospitals[i].city }})
    cityId = temp.id

    for (let j = 0; j < hospitals[i].hospitals.length; j++) {
      map = maps.filter(m => m.id == hospitals[i].hospitals[j].id)
      data.push({
        name: hospitals[i].hospitals[j].name,
        address: hospitals[i].hospitals[j].address,
        phone: hospitals[i].hospitals[j].phone,
        latitude: Number(map[0].lat),
        longitude: Number(map[0].long),
        city_id: cityId,
        province_id: provinceId,
      })     
    }
  }

  return data
}

(async () => {
  const data = await generateData();
  const result = await prisma.hospital.createMany({ data });
  console.log(result);
})()
  .then(async () => {
    console.log("[SEED] Seeding table hospitals success");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
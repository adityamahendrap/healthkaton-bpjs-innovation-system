import prisma from "../prisma/prisma.js";
import infos from "../static/infos.json" assert { type: "json" };

// enum InfoType {
//   Pendaftaran      @map("Pendaftaran")
//   HakKewajiban     @map("Hak & Kewajiban")
//   Sanksi           @map("Sanksi")
//   FasilitasManfaat @map("Fasilitas & Manfaat")
//   CaraPembayaran   @map("Cara Pembayaran")
//   FAQ              @map("FAQ")
// }

// model Info {
//   id      Int      @id @default(autoincrement())
//   type    InfoType
//   title   String
//   content String

//   @@map("infos")
// }

async function generateData() {
  let data = [];

  for (let i = 0; i < infos.length; i++) {

    for (let j = 0; j < infos[i].data.length; j++) {
      data.push({
        type: infos[i].type,
        title: infos[i].data[j].title,
        content: infos[i].data[j].content,
      });
    }

  }

  return data;
}

(async () => {
  const data = await generateData();
  const result = await prisma.info.createMany({ data });
  console.log(result);
})()
  .then(async () => {
    console.log("[SEED] Seeding table infos success");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

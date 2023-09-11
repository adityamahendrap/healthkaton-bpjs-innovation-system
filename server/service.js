import prisma from './prisma/prisma.js';
import Vector2 from './lib/Vector2.js';
import axios from 'axios';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function longLatDistanceVector2ToKilometer(longLatVector2) {
  return Number((longLatVector2 * 1113.25).toFixed(2))
}

const service = {
  askGPT: async (question) => {
    console.log("asking gpt:", question)
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: "gpt-3.5-turbo",
    });
    return chatCompletion.choices[0].message.content;
  },

  getUserPositionInformation: async (long, lat) => {
    console.log("getting position from posstack:", long, lat);
    const { data } = await axios.get(`http://api.positionstack.com/v1/reverse?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${lat},${long}`)
    return data.data[0]
  },

  getNearestHospital: async (long, lat) => {
    const currentPosition = new Vector2(long, lat);

    let hospitals
    try {
      hospitals = await prisma.hospital.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          Province: true,
          City: true,
        },
        where: {
          province_id: 17
        }
      })
    } catch (err) {
      console.error(err)
      return []
    }

    const hospitalsDetail = await Promise.all(hospitals.map(hospital => {
      let position = new Vector2(hospital.longitude, hospital.latitude)
      let distance = Vector2.distance(currentPosition, position)
      return {
        ...hospital,
        position,
        distance,
        distance_km: longLatDistanceVector2ToKilometer(distance),
        gmaps_url: `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`,
      }
    }))
    const sortedByNearestDistance = hospitalsDetail.sort((a, b) => a.distance - b.distance)
    let nearestHospitals = sortedByNearestDistance.slice(0, 3)

    const compareRegionResult = await Promise.all(nearestHospitals.map(async (hospital) => {
      return await service.compareRegion(
        { long: hospital.longitude, lat: hospital.latitude }, 
        { long, lat }
      )
    }))

    nearestHospitals = nearestHospitals.map((hospital, index) => {
      return {
        ...hospital,
        ...compareRegionResult[index],
      }
    })

    return nearestHospitals
  },

  compareRegion: async (hospital, user) => {
    const [userDataResponse, hospitalDataResponse] = await Promise.all([
      axios.get(`http://api.positionstack.com/v1/reverse?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${hospital.lat},${hospital.long}`),
      axios.get(`http://api.positionstack.com/v1/reverse?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${user.lat},${user.long}`),
    ]);
    const userData = userDataResponse?.data?.data
    const hospitalData = hospitalDataResponse?.data?.data
    const result = {
      is_in_same_province: userData[0]?.region == hospitalData[0]?.region,
      is_in_same_city: userData[0]?.county == hospitalData[0]?.county,
    }
    return result
  },

  getBedAvailability: async (hospitalId) => {
    try {
      let beds = await prisma.hospital.findFirst({
        where: { id: hospitalId },
        ...querySelectGetBedAvailability
      });
      return beds
    } catch (err) {
      console.error(err);
      return null
    }
  },

  getBedAvailabilityInNearestHospital: async (long, lat) => {
    try {
      const nearestHospitals = await service.getNearestHospital(long, lat)
      const hospitalsId = nearestHospitals.map(hospital => hospital.id)
      let beds = await prisma.hospital.findMany({
        where: { id: { in: hospitalsId } },
        ...querySelectGetBedAvailability
      });

      beds = beds.map((bed)=> {
        return {
          ...bed,
          extra: nearestHospitals.find(hospital => hospital.id == bed.id)
        }
      })

      return beds
    } catch (err) {
      console.error(err);
      return []
    }
  },
}

const querySelectGetBedAvailability = {
  select: {
    id: true,
    name: true,
    address: true,
    phone: true,
    Province: true,
    City: true,
    Beds: {
      select: {
        total: true,
        empty: true,
        queue: true,
        BedClass: {
          select: {
            name: true,
          }
        }
      }
    }
  }
}

export default service

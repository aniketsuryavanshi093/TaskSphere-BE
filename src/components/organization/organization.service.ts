import Project from '@projects/projects.model'
import AppError from '../../utils/appError'
import Organization from './oragnization.model'
import mongoose from 'mongoose'

export const createOrganization = async (input: any) => {
  const doc = await Organization.create(input)
  return doc ? doc : null
}

export const getOrganization = async (filter: any) => {
  try {
    filter.isDeleted = false
    const doc = await Organization.findOne(filter)
    return doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const getOrganizationProject = async (
  userId: string,
  isForOrganization: boolean,
  sortBy: string,
  sortOrder: string,
  page: string,
  perPage: string,
  isForAnalytics: boolean
) => {
  try {
    if (!isForOrganization && !isForAnalytics) {
      const doc = await Organization.findById(userId)
        .populate({
          path: 'projects',
        })
        .select('projects')
      return doc?._doc
    } else if (isForAnalytics) {
      const result = await Project.aggregate([
        {
          $match: {
            organizationId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'members',
            localField: 'members',
            foreignField: '_id',
            as: 'members',
          },
        },
        {
          $lookup: {
            from: 'tickets',
            localField: '_id',
            foreignField: 'projectId',
            as: 'tickets',
          },
        },
        {
          $unwind: '$tickets',
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            membersCount: { $first: { $size: '$members' } },
            ticketsCount: { $sum: 1 },
            progressCount: {
              $sum: {
                $cond: {
                  if: {
                    $in: ['$tickets.status', ['progress']],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            todoCount: {
              $sum: {
                $cond: {
                  if: {
                    $in: ['$tickets.status', ['pending']],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            doneCount: {
              $sum: {
                $cond: {
                  if: {
                    $in: ['$tickets.status', ['done']],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            updatedAt: { $first: '$updatedAt' },
          },
        },
      ])
      return { data: result }
    } else {
      const result = await Project.aggregate([
        {
          $match: {
            organizationId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'members',
            localField: 'members',
            foreignField: '_id',
            as: 'members',
          },
        },
        {
          $lookup: {
            from: 'tickets',
            localField: '_id',
            foreignField: 'projectId',
            as: 'tickets',
          },
        },
        {
          $unwind: '$tickets',
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            membersCount: { $first: { $size: '$members' } },
            ticketsCount: { $sum: 1 },
            activeCount: {
              $sum: {
                $cond: {
                  if: {
                    $in: ['$tickets.status', ['progress', 'pending']],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            createdAt: { $first: '$createdAt' },
          },
        },
        {
          $sort: {
            [sortBy]: sortOrder === 'ASC' ? 1 : -1,
          },
        },
        {
          $facet: {
            totalCount: [
              {
                $count: 'total',
              },
            ],
            paginatedResults: [
              {
                $sort: {
                  [sortBy]: sortOrder === 'ASC' ? 1 : -1,
                },
              },
              {
                $skip: (parseInt(page) - 1) * parseInt(perPage),
              },
              {
                $limit: parseInt(perPage),
              },
            ],
          },
        },
      ])
      const [totalRequestCount] = result[0].totalCount
      const paginatedResults = result[0].paginatedResults

      return { totalRequestCount, paginatedResults }
    }
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

// // =========================== create boooking service ======================
// export const createBookingService = async (
//   bookedBy: string,
//   currentAddress: AddressType,
//   destinationAddress: AddressType
// ): Promise<TBooking | boolean> => {
//   try {
//     // getting latitude and longitude for calculating the distance

//     const currentLocation = currentAddress.coordinates.toString().split(',')
//     const destinationLocation = destinationAddress.coordinates
//       .toString()
//       .split(',')

//     const curlat = currentLocation[0]
//     const curlon = currentLocation[1]
//     const deslat = destinationLocation[0]
//     const deslon = destinationLocation[1]

//     const disInKm = getDistanceFromLatLonInKm(
//       Number(curlat),
//       Number(curlon),
//       Number(deslat),
//       Number(deslon)
//     )

//     //getting price using math.ceil to get exact value not decimal value
//     const price: number = Math.ceil(15 * disInKm)

//     const radius: number = 10 / 3963.2
//     //filter for finding cab in 10 miles
//     const filterOption = {
//       currentLoc: {
//         $geoWithin: {
//           $centerSphere: [[curlat, curlon], radius],
//         },
//       },
//     }
//     const cab = await findAvailableCab(filterOption)
//     if (!cab) {
//       return false
//     }

//     const bookCab = await Booking.create({
//       currentAddress,
//       destinationAddress,
//       bookedBy,
//       cab: cab._id,
//       price,
//     })
//     if (bookCab) {
//       cab.booked = true
//       await cab.save()
//       return bookCab
//     } else {
//       throw new AppError('failed to book cab')
//     }
//   } catch (error) {
//     throw new AppError(error)
//   }
// }

// // ========================== find available cab service ============================
// export const findAvailableCab = async (filter: any): Promise<TCab> => {
//   try {
//     filter.booked = false
//     filter.isDeleted = false
//     const cab = await Cab.findOne(filter)
//     return cab
//   } catch (error) {
//     throw new AppError(error)
//   }
// }

// // get all bookings
// export const getAll = async (): Promise<TBooking[]> => {
//   try {
//     const bookings = await Booking.aggregate([
//       {
//         $match: { isDeleted: { $eq: false } },
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'bookedBy',
//           foreignField: '_id',
//           as: 'bookedBy',
//           pipeline: [
//             {
//               $project: { name: 1, email: 1, phoneNo: 1 },
//             },
//           ],
//         },
//       },
//       {
//         $lookup: {
//           from: 'cabs',
//           localField: 'cab',
//           foreignField: '_id',
//           as: 'cab',
//           pipeline: [
//             {
//               $lookup: {
//                 from: 'users',
//                 localField: 'driver',
//                 foreignField: '_id',
//                 as: 'driver',
//                 pipeline: [{ $project: { name: 1, email: 1, phoneNo: 1 } }],
//               },
//             },
//             {
//               $unwind: '$driver',
//             },
//             {
//               $project: { booked: 1, driver: 1 },
//             },
//           ],
//         },
//       },
//       {
//         $unwind: '$bookedBy',
//       },
//       {
//         $unwind: '$cab',
//       },
//       {
//         $project: { isDeleted: 0 },
//       },
//     ])
//     return bookings
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// // ================================= cancel booking service ================================
// export const cancelBookingService = async (
//   _id: string,
//   userId: string
// ): Promise<boolean> => {
//   try {
//     const doc = await Booking.findOne({ _id, bookedBy: userId })
//     if (!doc) {
//       return false
//     }
//     doc.isDeleted = true
//     const cancelbookdoc = await doc.save()
//     return cancelbookdoc ? true : false
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// // ======================= get user booking service ====================
// export const getUserBookings = async (userId: string): Promise<TBooking[]> => {
//   try {
//     const bookings = await Booking.find({ bookedBy: userId })
//     return bookings
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// // ========================= book cab by id service =========================
// export const bookCabService = async (
//   userId: string,
//   cabId: string,
//   currentAddress: AddressType,
//   destinationAddress: AddressType
// ): Promise<TBooking | false> => {
//   try {
//     // getting latitude and longitude for calculating the distance

//     const currentLocation = currentAddress.coordinates.toString().split(',')
//     const destinationLocation = destinationAddress.coordinates
//       .toString()
//       .split(',')

//     const curlat = currentLocation[0]
//     const curlon = currentLocation[1]
//     const deslat = destinationLocation[0]
//     const deslon = destinationLocation[1]

//     const disInKm = getDistanceFromLatLonInKm(
//       Number(curlat),
//       Number(curlon),
//       Number(deslat),
//       Number(deslon)
//     )

//     //getting price using math.ceil to get exact value not decimal value
//     const price: number = Math.ceil(15 * disInKm)

//     //finding cab  by its id
//     const filterOption = {
//       _id: cabId,
//     }
//     const cab = await findAvailableCab(filterOption)
//     if (!cab) {
//       return false
//     }

//     const bookCab = await Booking.create({
//       currentAddress,
//       destinationAddress,
//       bookedBy: userId,
//       cab: cab._id,
//       price,
//     })
//     if (bookCab) {
//       cab.booked = true
//       await cab.save()
//       return bookCab
//     } else {
//       throw new AppError('failed to book cab')
//     }
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// // ============================== get booking for cab driver ============================
// export const bookingForCabDriverService = async (
//   driver: string
// ): Promise<TBooking | boolean> => {
//   try {
//     const cab = await Cab.findOne({ driver, booked: true })
//     if (!cab) {
//       return false
//     }

//     const booking = await Booking.findOne({ cab })
//     if (!booking) {
//       return false
//     }
//     return booking
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// export const droppedDeletebookingService = async (
//   driver: string,
//   _id: string
// ): Promise<boolean> => {
//   try {
//     const cab = await Cab.findOne({ driver, booked: true })
//     if (!cab) {
//       throw new AppError('no bookings or already deleted', 403)
//     }
//     const booking = await Booking.findOne({ _id, cab: cab._id })
//     if (!booking) {
//       throw new AppError('no bookings or already deleted', 403)
//     }
//     booking.isDeleted = true
//     cab.booked = false
//     await booking.save()
//     await cab.save()
//     return true
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// export const getNearCabService = async (
//   lat: number,
//   lon: number
// ): Promise<TCab[]> => {
//   try {
//     const radius = 10 / 3963.2

//     const filter = {
//       booked: false,
//       currentLoc: {
//         $geoWithin: {
//           $centerSphere: [[lat, lon], radius],
//         },
//       },
//     }

//     const cabs = await Cab.find(filter)
//     if (!cabs) {
//       throw new AppError('cabs are not available in your area', 403)
//     }
//     return cabs
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

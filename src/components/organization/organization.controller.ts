import { Request, Response, NextFunction } from 'express'
import AppError from '../../utils/appError'
import { getOrganizationProject, getOrganization } from './organization.service'
// import { cabBokingInput, getNearByCabInput } from '../../helpers/validation'
// import {
//   bookCabService,
//   bookingForCabDriverService,
//   cancelBookingService,
//   createBookingService,
//   droppedDeletebookingService,
//   getAll,
//   getNearCabService,
//   getUserBookings,
// } from './organization.service'

export const getOrganizationDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const userId = req.user._id
    const organization = await getOrganization({ _id: userId })
    return res.status(200).json({
      status: 'success',
      message: 'organization details fetch successfully',
      data: organization,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllorganizationsProject = async (
  req: Request,
  res: Response,
  next: NextFunction): Promise<void | Response> => {
  try {
    if (req.user.role !== 'organization') {
      throw new AppError('You are not authorized to access this route', 400)
    }
    const userId = req.user._id
    const organization = await getOrganizationProject(userId)
    return res.status(200).json({
      status: 'success',
      message: 'organization Projects details fetch successfully',
      data: organization,
    })
  } catch (error) {
    next(error)
  }
}
// // ======================================== create booking ================================
// export const createBooking = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   try {
//     const data = await cabBokingInput.validateAsync(req.body)
//     const userId = req.user._id
//     const bookcab = await createBookingService(
//       userId,
//       data.currentAddress,
//       data.destinationAddress
//     )
//     if (!bookcab) {
//       throw new AppError('no cabs are available in your area', 403)
//     }
//     return res.status(200).json({
//       status: 'success',
//       message: 'booking successfull',
//       data: bookcab,
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// // ================================== get all booking by admin ======================================
// export const getAllBookings = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   try {
//     if (req.user.role !== 'admin') {
//       throw new AppError('only admin can get all bookings', 400)
//     }
//     const bookings = await getAll()
//     return res
//       .status(200)
//       .json({ status: 'success', message: 'all bookings', data: bookings })
//   } catch (error) {
//     next(error)
//   }
// }

// // ==================================== cancel bookings by user =================================
// export const cancelBooking = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   try {
//     const _id = req.params.id
//     const userId = req.user._id

//     const booking = await cancelBookingService(_id, userId)
//     if (!booking) {
//       throw new AppError('no bookings found or already canceled', 403)
//     }
//     return res
//       .status(200)
//       .json({ status: 'success', message: 'booking canceled' })
//   } catch (error) {
//     next(error)
//   }
// }

// // =========================== get user bookings =========================================
// export const getMyBookings = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   try {
//     const userId = req.user._id
//     const bookings = await getUserBookings(userId)
//     return res
//       .status(200)
//       .json({ status: 'success', message: 'all bookings', data: bookings })
//   } catch (error) {
//     next(error)
//   }
// }

// //-------------------------------------------- book cab by id -----------------------------------------
// export const bookCabByid = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   try {
//     const cabId = req.params.cabId
//     const userId = req.user._id
//     const data = await cabBokingInput.validateAsync(req.body)

//     const booked = await bookCabService(
//       userId,
//       cabId,
//       data.currentAddress,
//       data.destinationAddress
//     )
//     if (!booked) {
//       throw new AppError('cab unavailable', 403)
//     }
//     return res.status(200).json({
//       status: 'success',
//       message: 'booking successfull',
//       data: booked,
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// // ======================== get booking for driver ========================
// export const getdriverbooking = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   try {
//     if (req.user.role !== 'driver') {
//       throw new AppError('access denied', 400)
//     }
//     const driver = req.user._id

//     const booking = await bookingForCabDriverService(driver)
//     if (!booking) {
//       throw new AppError('no bookings', 403)
//     }
//     return res
//       .status(200)
//       .json({ satus: 'success', message: 'booked', data: booking })
//   } catch (error) {
//     next(error)
//   }
// }

// // ================================== driver dropped pessanger ==========================
// export const dropped = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   try {
//     if (req.user.role !== 'driver') {
//       throw new AppError('access denied', 400)
//     }
//     const _id = req.params.id
//     const driver = req.user._id

//     const completed = await droppedDeletebookingService(driver, _id)
//     if (!completed) {
//       throw new AppError('no bookings or already deleted', 403)
//     }
//     return res
//       .status(200)
//       .json({ status: 'success', message: 'pessenger dropped!' })
//   } catch (error) {
//     next(error)
//   }
// }

// // =================================== get near by cab for user =============================

// export const getNearByCab = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   try {
//     const { lat, lon } = await getNearByCabInput.validateAsync(req.body)
//     const cabs = await getNearCabService(lat, lon)

//     return cabs.length > 0
//       ? res.status(200).json({
//           cabs,
//         })
//       : res.status(403).json({
//           message: 'no cab are available in your area!',
//         })
//   } catch (error) {
//     next(error)
//   }
// }

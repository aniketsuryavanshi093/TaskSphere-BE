// import AppError from '../../utils/appError'
// import { TUser, userInput } from './types'
// import User from './projects.model'

// export const create = async (input: userInput): Promise<TUser | boolean> => {
//   const doc = await User.create(input)
//   return doc ? doc : false
// }

// export const findOneBy = async (filter: any): Promise<TUser> => {
//   try {
//     filter.isDeleted = false
//     const doc = await User.findOne(filter)
//     return doc
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// export const findAndUpdate = async (
//   filter: any,
//   data: Partial<userInput>
// ): Promise<TUser | boolean> => {
//   try {
//     const doc = await User.findOne(filter)
//     doc.set(data)
//     const newdoc = await doc.save()
//     return newdoc
//   } catch (error) {
//     throw new AppError(error)
//   }
// }

// export const findAndDelete = async (data: any) => {
//   try {
//     data.isDeleted = false
//     const doc = await User.findOne(data, 'isDeleted')
//     if (!doc) {
//       return false
//     }
//     doc.isDeleted = true
//     const newDoc = await doc.save()
//     return newDoc ? true : false
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// //=============================== forgot password service =======================================
// export const forgotPasswordToken = async (email: string): Promise<string> => {
//   try {
//     const user = await User.findOne({ email })
//     if (!user) {
//       throw new AppError('invalid email', 400)
//     }
//     const resetToken = await user.createPasswordResetToken()
//     return resetToken
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// // password reset service
// export const resetPasswordService = async (
//   passwordResetToken: string,
//   newPassword: string
// ): Promise<boolean> => {
//   try {
//     const user = await User.findOne(
//       {
//         passwordResetToken,
//         passwordResetExpired: { $gt: Date.now() },
//       },
//       'phone email password passwordResetToken passwordResetExpired'
//     )

//     if (!user) {
//       return false
//     }

//     user.password = newPassword
//     user.passwordResetToken = undefined
//     user.passwordResetExpired = undefined
//     const doc = await user.save()
//     return doc ? true : false
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

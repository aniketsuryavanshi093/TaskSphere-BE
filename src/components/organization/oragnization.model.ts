// import db from '../../connections/masterDB'
// import mongoose from 'mongoose'
// import { TBooking } from './types'

// const { Schema } = mongoose

// // creating a booking schema
// const bookingSchema = new mongoose.Schema(
//   {
//     currentAddress: {
//       //Geo JSON
//       type: {
//         type: String,
//         default: 'Point',
//         enum: ['Point'],
//       },
//       coordinates: [Number],
//       address: String,
//     },
//     destinationAddress: {
//       // Geo JSON
//       type: {
//         type: String,
//         default: 'Point',
//         enum: ['Point'],
//       },
//       address: String,
//       coordinates: [Number],
//     },
//     price: {
//       type: Number,
//       required: [true, 'price is required'],
//     },
//     cab: {
//       type: Schema.Types.ObjectId,
//       ref: 'Cab',
//     },
//     bookedBy: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: [true, 'user is required'],
//     },
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       transform(doc, ret) {
//         delete ret.isDeleted
//         delete ret.__v
//       },
//     },
//   }
// )

// bookingSchema.pre(/^find/, async function (next) {
//   this.populate('bookedBy', 'name email phoneNo')
//   this.populate('cab', '-isDeleted -__v')
//   next()
// })

// const Booking = db.model<TBooking>('Booking', bookingSchema)

// export default Booking

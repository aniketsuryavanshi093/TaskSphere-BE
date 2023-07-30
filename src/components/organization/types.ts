import { Document } from 'mongoose'

export interface AddressType {
  type: string
  coordinates: number[]
  address: string
}

export interface BookingInputType {
  currentAddress: AddressType
  destinationAddress: AddressType
  price: number
  cab: string
  bookedBy: string
  isDeleted: boolean
}

export interface TBooking extends BookingInputType, Document {}

import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);

    try{
        const savedRoom = await newRoom.save();
        try{
            // got to the hotel to which this room belongs and add this room to the hotel
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: {rooms: savedRoom._id},
            });
        }
        catch(error){
            next(error);
        }
        res.status(200).json(savedRoom);
    }catch(err){
        next(err);
    }
};
export const updateRoom = async(req, res, next) => {
    // const updatedRoom = new Room(req.body)
    try{
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body},
            {new: true}
        );
        res.status(200).json(updatedRoom)
    }
    catch(error){
        next(error);
    }
}
export const deleteRoom = async(req, res, next) => {
    // const updatedRoom = new Room(req.body)
    const hotelId = req.params.hotelid;
 
    try{
        await Room.findByIdAndDelete(req.params.id);
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: {rooms: req.params.id},
            });
        } catch (error) {
            next(createError(405, "Hotel id error"));
        }
        res.status(200).json("Room Deleted");
    }
    catch(error){
        next(error);
    }
}
export const getRoom =  async(req, res, next) => {
    // const updatedRoom = new Room(req.body)

    try{
        const getRoom = await Room.findById(req.params.id);
        res.status(200).json(getRoom);
    }
    catch(error){
        next(error)
    }
}
export const getAllRooms = async(req, res, next) => {
    try{
        const getRooms = await Room.find();
        res.status(200).json(getRooms);
    }
    catch(error){
        next(error);
    } 
}

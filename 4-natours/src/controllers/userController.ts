import {users} from '../../dev-data'
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';

const getAllUsers = catchAsync(async (req: any, res: any) => {
    const users = await User.find();
    // --------------- SEND RESPONSE
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: users?.length ?? 0,
        data: { users },
    })
})

const createUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const getUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const updateUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const deleteUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}


export {getAllUsers, createUser, getUser, updateUser, deleteUser}

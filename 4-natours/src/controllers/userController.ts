import {users} from '../../dev-data'

 const getAllUsers = (req: any, res: any) => {
    // res.status(200).json({
    //     status: 'success',
    //     results: users.length ?? 0,
    //     data: {
    //         users
    //     }
    // })

    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

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

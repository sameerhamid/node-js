import Tour from "../models/tourModel";
import catchAsync from "../utils/catchAsync";

const getOverview = catchAsync(async (req: any, res: any) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
})

const getTour = (req: any, res: any) => {
    res.status(200).render('tour', {
        title: 'The forest hicker'
    });
}

export { getOverview, getTour }

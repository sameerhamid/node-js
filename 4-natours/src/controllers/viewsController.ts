
const getOverview = (req: any, res: any) => {
    res.status(200).render('overview', {
        title: 'All Tours'
    });
}

const getTour = (req: any, res: any) => {
    res.status(200).render('tour', {
        title: 'The forest hicker'
    });
}

export { getOverview, getTour }

import { FetchProfileData } from '../models/queries.js';
const handleFetchProfileData = async (req, res) => {
    try {
        const { role, id, from } = req.query;
        if (typeof role !== 'string'
            || typeof id !== 'string'
            || typeof from !== 'string') {
            res.sendStatus(400);
            return;
        }
        ;
        const result = await FetchProfileData(role, id, from);
        result.role = role;
        result.dates = result.dates[0];
        delete result.credits;
        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('FETCH PROFILE DATA CONTROLLER ERROR');
    }
};
export default handleFetchProfileData;

import { FetchAvatar } from '../models/queries.js';
const handleFetchAvatar = async (req, res) => {
    try {
        const { email, role } = req.query;
        if (typeof email !== 'string'
            || typeof role !== 'string') {
            res.sendStatus(400);
            return;
        }
        ;
        const result = await FetchAvatar(email, role);
        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('FETCH AVATAR CONTROLLER ERROR');
    }
    ;
};
export default handleFetchAvatar;
